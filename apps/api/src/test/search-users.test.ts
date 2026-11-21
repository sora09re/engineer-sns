import type { User } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp, uniqueWord } from "./app";
import { withRollback } from "./db";
import { createUser, updateProfile } from "./fixtures";

const search = (q: string) => {
	return `/api/users/search?${new URLSearchParams({ q })}`;
};

const usernamesOf = async (res: Response) => {
	return ((await res.json()) as User[]).map((user) => user.username);
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
			await updateProfile(db, byName.id, { name: `${word.toUpperCase()} さん` });
			await updateProfile(db, byBio.id, { bio: `${word} が好き` });

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
			await updateProfile(db, hit.id, { bio: `${word}${symbol}end` });
			await updateProfile(db, miss.id, { bio: `${word}xend` });

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
