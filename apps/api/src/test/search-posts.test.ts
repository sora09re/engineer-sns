import { describe, expect, test } from "vite-plus/test";

import { contentsOf, setupApp } from "./app";
import { withRollback } from "./db";
import { createPost, createUser } from "./fixtures";

/** シードなど既存の投稿と重ならないキーワード（英小文字だけにして、大文字にしても別の語にならないようにする） */
const uniqueWord = () => {
	return `kw${crypto.randomUUID().replaceAll("-", "").replace(/[0-9]/g, "")}`;
};

const search = (q: string) => {
	return `/api/posts/search?${new URLSearchParams({ q })}`;
};

describe("GET /api/posts/search", () => {
	test("本文にキーワードを含む、コメントでない投稿を新しい順に返す。大文字と小文字は区別しない", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const word = uniqueWord();
			const post = await createPost(db, {
				userId: me.id,
				content: `${word.toUpperCase()} の型`,
				createdAt: "2026-01-01T00:00:00Z",
			});
			await createPost(db, {
				userId: me.id,
				content: `${word} で書く`,
				createdAt: "2026-01-02T00:00:00Z",
			});
			await createPost(db, { userId: me.id, content: "Rust の話" });
			await createPost(db, { userId: me.id, content: `${word} のコメント`, parentPostId: post.id });

			const res = await get(search(word.toUpperCase()), me.id);

			expect(res.status).toBe(200);
			expect(await contentsOf(res)).toEqual([`${word} で書く`, `${word.toUpperCase()} の型`]);
		});
	});

	test.each(["%", "_"])("%s はワイルドカードではなく文字として扱う", async (symbol) => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const word = uniqueWord();
			await createPost(db, { userId: me.id, content: `${word}${symbol}end` });
			// ワイルドカードとして扱うと、こちらにも一致してしまう
			await createPost(db, { userId: me.id, content: `${word}xend` });

			const res = await get(search(`${word}${symbol}end`), me.id);

			expect(await contentsOf(res)).toEqual([`${word}${symbol}end`]);
		});
	});

	test.each(["", "   "])("キーワードが空か空白だけ（%j）なら空", async (q) => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			await createPost(db, { userId: me.id, content: "なにかの投稿" });

			const res = await get(search(q), me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual([]);
		});
	});
});
