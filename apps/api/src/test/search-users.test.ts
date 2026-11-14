import type { User } from "@engineer-sns/shared";
import { sql } from "drizzle-orm";
import { describe, expect, test } from "vite-plus/test";

import type { Db } from "../infrastructure/db/client";
import { setupApp, uniqueWord } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

const search = (q: string) => {
	return `/api/users/search?${new URLSearchParams({ q })}`;
};

const usernamesOf = async (res: Response) => {
	return ((await res.json()) as User[]).map((user) => user.username);
};

/** 準備用: 名前と自己紹介を変える（ユーザーの編集の API はこの PR で作るので、ここでは直接書く） */
const setProfile = async (db: Db, id: string, values: { name?: string; bio?: string }) => {
	await db.execute(
		sql`update public.users set name = coalesce(${values.name ?? null}, name), bio = coalesce(${values.bio ?? null}, bio) where id = ${id}`,
	);
};

describe("GET /api/users/search", () => {
	test("名前・ユーザーネーム・自己紹介のどれかにキーワードを含むユーザーを返す。大文字と小文字は区別しない", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const word = uniqueWord();
			const byName = await createUser(db, "by_name");
			const byBio = await createUser(db, "by_bio");
			await createUser(db, `${word}_user`);
			await createUser(db, "nobody");
			await setProfile(db, byName.id, { name: `${word.toUpperCase()} さん` });
			await setProfile(db, byBio.id, { bio: `${word} が好き` });

			const res = await get(search(word.toUpperCase()), me.id);

			expect(res.status).toBe(200);
			expect((await usernamesOf(res)).sort()).toEqual(["by_bio", "by_name", `${word}_user`].sort());
		});
	});

	test("ユーザーネーム順に並べる", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const word = uniqueWord();
			await createUser(db, `${word}_c`);
			await createUser(db, `${word}_a`);
			await createUser(db, `${word}_b`);

			const res = await get(search(word), me.id);

			expect(await usernamesOf(res)).toEqual([`${word}_a`, `${word}_b`, `${word}_c`]);
		});
	});

	test.each(["%", "_"])("%s はワイルドカードではなく文字として扱う", async (symbol) => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const word = uniqueWord();
			const hit = await createUser(db, "hit");
			const miss = await createUser(db, "miss");
			await setProfile(db, hit.id, { bio: `${word}${symbol}end` });
			// ワイルドカードとして扱うと、こちらにも一致してしまう
			await setProfile(db, miss.id, { bio: `${word}xend` });

			const res = await get(search(`${word}${symbol}end`), me.id);

			expect(await usernamesOf(res)).toEqual(["hit"]);
		});
	});

	test.each(["", "   "])("キーワードが空か空白だけ（%j）なら空", async (q) => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await get(search(q), me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual([]);
		});
	});
});
