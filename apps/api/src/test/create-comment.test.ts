import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { contentsOf, setupApp } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

const setup = async (db: Parameters<typeof setupApp>[0]) => {
	const app = await setupApp(db);
	const author = await createUser(db, "author");
	const me = await createUser(db, "me");
	const res = await app.send("POST", "/api/posts", author.id, { content: "親の投稿" });
	const parent = (await res.json()) as PostType;
	return { ...app, author, me, parent };
};

describe("POST /api/posts/:postId/comments", () => {
	test("コメントでき、201 で返す。親の投稿のコメント一覧とコメント数に反映される", async () => {
		await withRollback(async (db) => {
			const { get, send, me, parent } = await setup(db);

			const res = await send("POST", `/api/posts/${parent.id}/comments`, me.id, {
				content: "コメントです",
			});

			expect(res.status).toBe(201);
			expect(await res.json()).toMatchObject({
				content: "コメントです",
				parent_post_id: parent.id,
				user_id: me.id,
			});
			const comments = await get(`/api/posts/${parent.id}/comments`, me.id);
			expect(await contentsOf(comments)).toEqual(["コメントです"]);
			const detail = await get(`/api/posts/${parent.id}`, me.id);
			expect(await detail.json()).toMatchObject({ comment_count: 1 });
		});
	});

	test.each(["00000000-0000-0000-0000-000000000000", "not-a-uuid"])(
		"親の投稿（%s）が存在しなければ 404",
		async (postId) => {
			await withRollback(async (db) => {
				const { send, me } = await setup(db);

				const res = await send("POST", `/api/posts/${postId}/comments`, me.id, {
					content: "コメント",
				});

				expect(res.status).toBe(404);
				expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
			});
		},
	);

	test("本文が空白だけなら 422", async () => {
		await withRollback(async (db) => {
			const { send, me, parent } = await setup(db);

			const res = await send("POST", `/api/posts/${parent.id}/comments`, me.id, { content: " " });

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "本文を入力してください。" });
		});
	});

	test("ユーザーのないアカウントなら 403", async () => {
		await withRollback(async (db) => {
			const { send, parent } = await setup(db);

			const res = await send("POST", `/api/posts/${parent.id}/comments`, crypto.randomUUID(), {
				content: "コメント",
			});

			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ message: "新規ユーザー登録が済んでいません。" });
		});
	});

	test.each([
		["content がない", {}],
		["content が文字列でない", { content: 42 }],
	])("本文の形が不正（%s）なら 422", async (_, body) => {
		await withRollback(async (db) => {
			const { app, send, sign, me, parent } = await setup(db);

			const res = await send("POST", `/api/posts/${parent.id}/comments`, me.id, body);

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "本文を入力してください。" });
		});
	});

	test("本文が JSON として読めなければ 400", async () => {
		await withRollback(async (db) => {
			const { app, send, sign, me, parent } = await setup(db);

			const res = await app.request(`/api/posts/${parent.id}/comments`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${await sign({ sub: me.id })}`,
					"Content-Type": "application/json",
				},
				body: "{ content: これは JSON ではない",
			});

			expect(res.status).toBe(400);
			expect(await res.json()).toEqual({ message: "リクエストの形式が正しくありません。" });
		});
	});
});
