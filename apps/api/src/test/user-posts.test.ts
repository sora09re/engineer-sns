import { describe, expect, test } from "vite-plus/test";

import { contentsOf, setupApp } from "./app";
import { withRollback } from "./db";
import { createPost, createUser } from "./fixtures";

describe("GET /api/users/:userId/posts", () => {
	test("そのユーザーの投稿を、コメントも含めて新しい順に返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const author = await createUser(db, "author");
			const othersPost = await createPost(db, {
				userId: me.id,
				content: "ほかの人の投稿",
				createdAt: "2026-01-01T00:00:00Z",
			});
			await createPost(db, {
				userId: author.id,
				content: "古い投稿",
				createdAt: "2026-01-02T00:00:00Z",
			});
			await createPost(db, {
				userId: author.id,
				content: "新しいコメント",
				parentPostId: othersPost.id,
				createdAt: "2026-01-03T00:00:00Z",
			});

			const res = await get(`/api/users/${author.id}/posts`, me.id);

			expect(res.status).toBe(200);
			expect(await contentsOf(res)).toEqual(["新しいコメント", "古い投稿"]);
		});
	});
});
