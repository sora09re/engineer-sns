import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

const setup = async (db: Parameters<typeof setupApp>[0]) => {
	const app = await setupApp(db);
	const me = await createUser(db, "me");
	const other = await createUser(db, "other");
	const createPost = async (accountId: string, content: string) => {
		const res = await app.send("POST", "/api/posts", accountId, { content });
		return (await res.json()) as PostType;
	};
	return { ...app, me, other, createPost };
};

describe("DELETE /api/posts/:postId", () => {
	test("自分の投稿は削除でき、204 を返す。そのあと詳細は 404", async () => {
		await withRollback(async (db) => {
			const { get, send, me, createPost } = await setup(db);
			const post = await createPost(me.id, "消す投稿");

			const res = await send("DELETE", `/api/posts/${post.id}`, me.id);

			expect(res.status).toBe(204);
			const detail = await get(`/api/posts/${post.id}`, me.id);
			expect(detail.status).toBe(404);
		});
	});

	test("ほかのユーザーの投稿なら 403 で、投稿は残る", async () => {
		await withRollback(async (db) => {
			const { get, send, me, other, createPost } = await setup(db);
			const post = await createPost(other.id, "ほかの人の投稿");

			const res = await send("DELETE", `/api/posts/${post.id}`, me.id);

			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ message: "この投稿は削除できません。" });
			const detail = await get(`/api/posts/${post.id}`, me.id);
			expect(detail.status).toBe(200);
		});
	});

	test.each(["00000000-0000-0000-0000-000000000000", "not-a-uuid"])(
		"存在しない投稿（%s）なら 404",
		async (postId) => {
			await withRollback(async (db) => {
				const { send, me } = await setup(db);

				const res = await send("DELETE", `/api/posts/${postId}`, me.id);

				expect(res.status).toBe(404);
				expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
			});
		},
	);

	test("投稿を削除すると、そのコメントも消える", async () => {
		await withRollback(async (db) => {
			const { get, send, me, other, createPost } = await setup(db);
			const post = await createPost(me.id, "親の投稿");
			const commentRes = await send("POST", `/api/posts/${post.id}/comments`, other.id, {
				content: "コメント",
			});
			const comment = (await commentRes.json()) as PostType;

			await send("DELETE", `/api/posts/${post.id}`, me.id);

			const detail = await get(`/api/posts/${comment.id}`, me.id);
			expect(detail.status).toBe(404);
		});
	});
});
