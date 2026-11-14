import { describe, expect, test } from "vite-plus/test";

import { contentsOf, setupApp } from "./app";
import { withRollback } from "./db";
import { createPost, createUser } from "./fixtures";

describe("GET /api/posts/:postId/comments", () => {
	test("その投稿へのコメントだけを新しい順に返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const post = await createPost(db, { userId: me.id, content: "親の投稿" });
			const other = await createPost(db, { userId: me.id, content: "ほかの投稿" });
			await createPost(db, {
				userId: me.id,
				content: "古いコメント",
				parentPostId: post.id,
				createdAt: "2026-01-01T00:00:00Z",
			});
			await createPost(db, {
				userId: me.id,
				content: "新しいコメント",
				parentPostId: post.id,
				createdAt: "2026-01-02T00:00:00Z",
			});
			await createPost(db, { userId: me.id, content: "ほかへのコメント", parentPostId: other.id });

			const res = await get(`/api/posts/${post.id}/comments`, me.id);

			expect(res.status).toBe(200);
			expect(await contentsOf(res)).toEqual(["新しいコメント", "古いコメント"]);
		});
	});

	// 詳細ページは投稿とコメントを並列に取る。投稿が 404 のとき、コメント側が失敗すると 404 の表示にならない
	test.each(["00000000-0000-0000-0000-000000000000", "not-a-uuid"])(
		"存在しない投稿（%s）なら空",
		async (postId) => {
			await withRollback(async (db) => {
				const { get } = await setupApp(db);
				const me = await createUser(db, "me");

				const res = await get(`/api/posts/${postId}/comments`, me.id);

				expect(res.status).toBe(200);
				expect(await res.json()).toEqual([]);
			});
		},
	);
});
