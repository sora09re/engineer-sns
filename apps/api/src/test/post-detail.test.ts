import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createPost, createUser, like } from "./fixtures";

describe("GET /api/posts/:postId", () => {
	test("投稿を、投稿者・いいね・コメント数つきで返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const author = await createUser(db, "author");
			const post = await createPost(db, {
				userId: author.id,
				content: "見たい投稿",
				createdAt: "2026-02-03T04:05:06Z",
			});
			await createPost(db, { userId: me.id, content: "コメント", parentPostId: post.id });
			const myLike = await like(db, me.id, post.id);

			const res = await get(`/api/posts/${post.id}`, me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual({
				id: post.id,
				comment_count: 1,
				content: "見たい投稿",
				created_at: "2026-02-03T04:05:06.000Z",
				likes: [{ id: myLike.id, post_id: post.id, user_id: me.id }],
				parent_post_id: null,
				user_id: author.id,
				users: {
					id: author.id,
					created_at: expect.any(String),
					email: "author@example.com",
					name: "author",
					updated_at: expect.any(String),
					username: "author",
				},
			});
		});
	});

	test("コメントも、ID を指定すれば 1 件の投稿として返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const post = await createPost(db, { userId: me.id, content: "親の投稿" });
			const comment = await createPost(db, {
				userId: me.id,
				content: "コメント",
				parentPostId: post.id,
			});

			const res = await get(`/api/posts/${comment.id}`, me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toMatchObject({
				id: comment.id,
				content: "コメント",
				parent_post_id: post.id,
			});
		});
	});

	test("存在しない ID なら 404", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await get("/api/posts/00000000-0000-0000-0000-000000000000", me.id);

			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
		});
	});

	test("UUID の形をしていない ID も 404", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await get("/api/posts/not-a-uuid", me.id);

			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
		});
	});
});
