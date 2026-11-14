/**
 * E2E / VRT 用の Supabase 操作。テスト用のアカウントとデータを service role で直接作る。
 * service role は RLS を無視できるので、ローカルの Supabase 以外では絶対に動かさない。
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

interface SupabaseEnv {
	url: string;
	anonKey: string;
	serviceRoleKey: string;
}

let cachedEnv: SupabaseEnv | undefined;

const readDotEnv = (path: string): Record<string, string> => {
	try {
		return Object.fromEntries(
			readFileSync(path, "utf8")
				.split("\n")
				.map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/))
				.filter((match) => match !== null)
				.map((match) => [match[1], match[2]]),
		);
	} catch {
		return {};
	}
};

export const SERVICE_ROLE_KEY_ENV = "E2E_SUPABASE_SERVICE_ROLE_KEY";

/**
 * supabase status から service role key を取る。E2E_SUPABASE_WORKDIR があれば --workdir に渡す。
 * 同期実行なので、ワーカーで呼ぶとテストのタイムアウトも効かなくなる。
 * global setup で 1 回だけ呼び、結果は環境変数でワーカーに渡す。
 */
const readServiceRoleKey = (): string => {
	if (process.env[SERVICE_ROLE_KEY_ENV]) {
		return process.env[SERVICE_ROLE_KEY_ENV];
	}
	const workdir = process.env.E2E_SUPABASE_WORKDIR;
	const output = execFileSync(
		"pnpm",
		["exec", "supabase", "status", "-o", "env", ...(workdir ? ["--workdir", workdir] : [])],
		{ encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 60_000 },
	);
	const key = output.match(/^SERVICE_ROLE_KEY="?([^"\n]+)"?$/m)?.[1];
	if (!key) {
		throw new Error("supabase status から SERVICE_ROLE_KEY を取得できませんでした。");
	}
	return key;
};

export const supabaseEnv = (): SupabaseEnv => {
	if (cachedEnv) {
		return cachedEnv;
	}
	const dotEnv = readDotEnv(".env.local");
	const url = process.env.VITE_SUPABASE_URL ?? dotEnv.VITE_SUPABASE_URL;
	const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? dotEnv.VITE_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		throw new Error(
			".env.local に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください。",
		);
	}
	const { hostname } = new URL(url);
	if (hostname !== "127.0.0.1" && hostname !== "localhost") {
		throw new Error(`E2E はローカルの Supabase でのみ実行できます（VITE_SUPABASE_URL=${url}）。`);
	}
	cachedEnv = { url, anonKey, serviceRoleKey: readServiceRoleKey() };
	return cachedEnv;
};

const request = async <T>(path: string, init: RequestInit & { key?: "anon" | "service" } = {}) => {
	const env = supabaseEnv();
	const key = init.key === "anon" ? env.anonKey : env.serviceRoleKey;
	const response = await fetch(`${env.url}${path}`, {
		...init,
		headers: {
			apikey: key,
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json",
			...init.headers,
		},
	});
	const text = await response.text();
	if (!response.ok) {
		throw new Error(`${init.method ?? "GET"} ${path} → ${response.status}: ${text}`);
	}
	return (text ? JSON.parse(text) : undefined) as T;
};

/** テストで作るアカウントのメールアドレスの接頭辞。後片付けはこれで見分ける */
export const TEST_EMAIL_PREFIXES = ["e2e-", "vrt-"] as const;

export interface TestAccount {
	id: string;
	email: string;
	password: string;
}

export const createAccount = async (email: string, id?: string): Promise<TestAccount> => {
	const password = `pw-${crypto.randomUUID()}`;
	const user = await request<{ id: string }>("/auth/v1/admin/users", {
		method: "POST",
		body: JSON.stringify({ id, email, password, email_confirm: true }),
	});
	return { id: user.id, email, password };
};

/** テスト用のアカウント（e2e-* / vrt-*）をすべて消す。ユーザーや投稿は CASCADE で消える */
export const deleteTestAccounts = async () => {
	for (let page = 1; ; page++) {
		const { users } = await request<{ users: { id: string; email?: string }[] }>(
			`/auth/v1/admin/users?page=${page}&per_page=1000`,
		);
		const targets = users.filter((user) => {
			return TEST_EMAIL_PREFIXES.some((prefix) => user.email?.startsWith(prefix));
		});
		for (const user of targets) {
			await request(`/auth/v1/admin/users/${user.id}`, { method: "DELETE" });
		}
		if (users.length < 1000) {
			break;
		}
	}
};

/** service role で行を入れる（RLS を通さずにフィクスチャを作るため） */
export const insertRows = async (table: string, rows: Record<string, unknown>[]) => {
	await request(`/rest/v1/${table}`, {
		method: "POST",
		headers: { Prefer: "return=minimal" },
		body: JSON.stringify(rows),
	});
};

export interface Session {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	user: { id: string };
}

export const signInWithPassword = async (account: TestAccount) => {
	return request<Session>("/auth/v1/token?grant_type=password", {
		method: "POST",
		key: "anon",
		body: JSON.stringify({ email: account.email, password: account.password }),
	});
};

/** supabase-js がセッションを保存する localStorage のキー（sb-<ホスト名の先頭>-auth-token） */
export const sessionStorageKey = () => {
	return `sb-${new URL(supabaseEnv().url).hostname.split(".")[0]}-auth-token`;
};
