/**
 * フロントから DB と Storage に直接アクセスできないこと（読み書きはすべて API を通す。docs/adr/0002）。
 * HTTP の API では確かめられないので、ここだけ DB にログイン済みのロールで直接つなぐ。
 */
import { sql, type SQL } from "drizzle-orm";
import { describe, expect, test } from "vite-plus/test";

import type { Db } from "../infrastructure/db/client";
import { withRollback } from "./db";
import { createAccount } from "./fixtures";

/** Postgres のエラーのメッセージ（drizzle は元のエラーを cause に入れる）。成功したら null */
const errorMessageOf = async (promise: Promise<unknown>) => {
	try {
		await promise;
	} catch (error) {
		return error instanceof Error && error.cause instanceof Error
			? error.cause.message
			: String(error);
	}
	return null;
};

/** supabase-js がログイン済みでつなぐときと同じロールとクレームで、query を実行する */
const asAuthenticated = async (db: Db, accountId: string, query: SQL) => {
	await db.execute(sql`set local role authenticated`);
	await db.execute(
		sql`select set_config('request.jwt.claims', ${JSON.stringify({ sub: accountId, role: "authenticated" })}, true)`,
	);
	return db.execute(query);
};

/** テーブルの権限がない（RLS のポリシーで拒否されたときとは別のメッセージになる） */
const permissionDenied = (table: string) => {
	return `permission denied for table ${table}`;
};

describe("ログイン済みのロール（authenticated）からテーブルに直接アクセスできない", () => {
	const tables = ["users", "posts", "likes", "follows"] as const;
	const operations = {
		select: (table: string) =>
			sql`select 1 from ${sql.identifier("public")}.${sql.identifier(table)} limit 1`,
		insert: (table: string) =>
			sql`insert into ${sql.identifier("public")}.${sql.identifier(table)} default values`,
		update: (table: string) =>
			sql`update ${sql.identifier("public")}.${sql.identifier(table)} set created_at = now()`,
		delete: (table: string) =>
			sql`delete from ${sql.identifier("public")}.${sql.identifier(table)}`,
	};

	test.each(
		tables.flatMap((table) => Object.keys(operations).map((operation) => [table, operation])),
	)("%s を %s できない", async (table, operation) => {
		await withRollback(async (db) => {
			const accountId = await createAccount(db, "direct@example.com");

			const query = operations[operation as keyof typeof operations](table!);

			expect(await errorMessageOf(asAuthenticated(db, accountId, query))).toBe(
				permissionDenied(table!),
			);
		});
	});
});

describe("public に新しく作ったものに、anon と authenticated の権限が付かない", () => {
	test.each(["anon", "authenticated"])("%s", async (role) => {
		await withRollback(async (db) => {
			await db.execute(
				sql`create table public.direct_access_probe (id bigint generated always as identity)`,
			);
			await db.execute(
				sql`create function public.direct_access_probe_fn() returns int language sql as 'select 1'`,
			);

			const [row] = await db.execute<{ table: boolean; sequence: boolean; fn: boolean }>(sql`
				select
					has_table_privilege(${role}, 'public.direct_access_probe', 'select, insert, update, delete') as table,
					has_sequence_privilege(${role}, 'public.direct_access_probe_id_seq', 'usage, select, update') as sequence,
					has_function_privilege(${role}, 'public.direct_access_probe_fn()', 'execute') as fn
			`);

			expect(row).toEqual({ table: false, sequence: false, fn: false });
		});
	});
});

describe("ログイン済みのロールから Storage に直接アップロードできない", () => {
	test("自分のフォルダでも profile_image に置けない（アップロードは API が発行する署名付き URL で行う）", async () => {
		await withRollback(async (db) => {
			const accountId = await createAccount(db, "direct@example.com");

			const query = sql`insert into storage.objects (bucket_id, name) values ('profile_image', ${`${accountId}/direct.png`})`;

			// storage.objects の権限は Supabase のものなので残る。insert のポリシーがないので RLS で拒否される
			expect(await errorMessageOf(asAuthenticated(db, accountId, query))).toBe(
				'new row violates row-level security policy for table "objects"',
			);
		});
	});
});
