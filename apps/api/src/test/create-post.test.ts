import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

describe("POST /api/posts", () => {
	test("自分の名義で投稿でき、201 で投稿を返す。詳細の API でも取れる", async () => {
		await withRollback(async (db) => {
			const { get, send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("POST", "/api/posts", me.id, { content: "新しい投稿" });

			expect(res.status).toBe(201);
			const created = (await res.json()) as PostType;
			expect(created).toMatchObject({
				content: "新しい投稿",
				comment_count: 0,
				likes: [],
				parent_post_id: null,
				user_id: me.id,
				users: { id: me.id, username: "me" },
			});
			const detail = await get(`/api/posts/${created.id}`, me.id);
			expect(await detail.json()).toEqual(created);
		});
	});

	test.each(["", "  \n\t "])("本文が空か空白だけ（%j）なら 422", async (content) => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("POST", "/api/posts", me.id, { content });

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "本文を入力してください。" });
		});
	});

	test("ユーザーのないアカウント（新規ユーザー登録の前）なら 403", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountWithoutUser = crypto.randomUUID();

			const res = await send("POST", "/api/posts", accountWithoutUser, { content: "投稿" });

			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ message: "新規ユーザー登録が済んでいません。" });
		});
	});
});
