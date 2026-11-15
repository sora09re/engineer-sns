import { test as base, expect, type Page } from "@playwright/test";

import {
	createAccount,
	insertRows,
	sessionStorageKey,
	signInWithPassword,
	type TestAccount,
} from "./supabase";

export interface TestUser extends TestAccount {
	name: string;
	username: string;
}

interface Fixtures {
	/** テストごとに新しいアカウントを作る。withProfile: false ならユーザー（プロフィール）を作らない */
	createUser: (options?: { withProfile?: boolean; name?: string }) => Promise<TestUser>;
	/** アカウントでログインした状態にする（GitHub OAuth の代わりにセッションを直接入れる） */
	signIn: (account: TestAccount) => Promise<void>;
}

/** 外部へのリクエスト（シードのプロフィール画像など）は止めて、結果を安定させる */
const blockExternalRequests = async (page: Page) => {
	await page.route(
		(url) => {
			return !["localhost", "127.0.0.1"].includes(url.hostname);
		},
		(route) => {
			return route.abort();
		},
	);
};

export const signIn = async (page: Page, account: TestAccount) => {
	const session = await signInWithPassword(account);
	await page.goto("/auth/signin");
	await page.evaluate(
		([key, value]) => {
			localStorage.setItem(key, value);
		},
		[sessionStorageKey(), JSON.stringify(session)] as const,
	);
};

export const test = base.extend<Fixtures>({
	page: async ({ page }, use) => {
		await blockExternalRequests(page);
		await use(page);
	},
	// Playwright は第 1 引数の分割代入から依存する fixture を読み取るので、依存がなくても {} が必要
	// oxlint-disable-next-line no-empty-pattern
	createUser: async ({}, use) => {
		await use(async ({ withProfile = true, name } = {}) => {
			const suffix = crypto.randomUUID().slice(0, 8);
			const account = await createAccount(`e2e-${suffix}@example.com`);
			const user = { ...account, name: name ?? `E2E ${suffix}`, username: `e2e_${suffix}` };
			if (withProfile) {
				await insertRows("users", [
					{ id: account.id, name: user.name, username: user.username, email: account.email },
				]);
			}
			return user;
		});
	},
	signIn: async ({ page }, use) => {
		await use((account) => {
			return signIn(page, account);
		});
	},
});

export { expect };

/** タイムラインなどの投稿カード */
export const postCard = (page: Page, text: string) => {
	return page.getByRole("article").filter({ hasText: text });
};

/** Mantine の通知 */
export const notification = (page: Page, message: string) => {
	return page.getByRole("alert").filter({ hasText: message });
};
