import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

const setup = async (db: Parameters<typeof setupApp>[0]) => {
	const app = await setupApp(db);
	const me = await createUser(db, "me");
	const other = await createUser(db, "other");
	const res = await app.send("POST", "/api/posts", other.id, { content: "いいねされる投稿" });
	const post = (await res.json()) as PostType;
	/** 投稿の詳細の likes から、いいねしたユーザーの ID を取り出す */
	const likerIds = async () => {
		const detail = await app.get(`/api/posts/${post.id}`, me.id);
		return ((await detail.json()) as PostType).likes.map((like) => like.user_id);
	};
	return { ...app, me, other, post, likerIds };
};

describe("PUT /api/posts/:postId/like", () => {
	test("いいねでき、204 を返す。投稿の likes に自分のいいねが入る", async () => {
		await withRollback(async (db) => {
			const { send, me, post, likerIds } = await setup(db);

			const res = await send("PUT", `/api/posts/${post.id}/like`, me.id);

			expect(res.status).toBe(204);
			expect(await likerIds()).toEqual([me.id]);
		});
	});

	test("すでにいいねしていても 204 で、いいねは 1 つのまま", async () => {
		await withRollback(async (db) => {
			const { send, me, post, likerIds } = await setup(db);
			await send("PUT", `/api/posts/${post.id}/like`, me.id);

			const res = await send("PUT", `/api/posts/${post.id}/like`, me.id);

			expect(res.status).toBe(204);
			expect(await likerIds()).toEqual([me.id]);
		});
	});
});

describe("DELETE /api/posts/:postId/like", () => {
	test("いいねを外せて、204 を返す。投稿の likes から自分のいいねが消える", async () => {
		await withRollback(async (db) => {
			const { send, me, post, likerIds } = await setup(db);
			await send("PUT", `/api/posts/${post.id}/like`, me.id);

			const res = await send("DELETE", `/api/posts/${post.id}/like`, me.id);

			expect(res.status).toBe(204);
			expect(await likerIds()).toEqual([]);
		});
	});

	test("いいねしていない投稿でも 204", async () => {
		await withRollback(async (db) => {
			const { send, me, post } = await setup(db);

			const res = await send("DELETE", `/api/posts/${post.id}/like`, me.id);

			expect(res.status).toBe(204);
		});
	});

	test("外れるのは自分のいいねだけで、ほかの人のいいねは残る", async () => {
		await withRollback(async (db) => {
			const { send, me, other, post, likerIds } = await setup(db);
			await send("PUT", `/api/posts/${post.id}/like`, me.id);
			await send("PUT", `/api/posts/${post.id}/like`, other.id);

			await send("DELETE", `/api/posts/${post.id}/like`, me.id);

			expect(await likerIds()).toEqual([other.id]);
		});
	});
});

describe("PUT / DELETE /api/posts/:postId/like の共通", () => {
	test.each([
		["PUT", "00000000-0000-0000-0000-000000000000"],
		["PUT", "not-a-uuid"],
		["DELETE", "00000000-0000-0000-0000-000000000000"],
		["DELETE", "not-a-uuid"],
	])("%s: 投稿（%s）が存在しなければ 404", async (method, postId) => {
		await withRollback(async (db) => {
			const { send, me } = await setup(db);

			const res = await send(method, `/api/posts/${postId}/like`, me.id);

			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
		});
	});

	test("ユーザーのないアカウントは、PUT なら 403、DELETE なら外すいいねがないので 204", async () => {
		await withRollback(async (db) => {
			const { send, post } = await setup(db);
			const accountWithoutUser = crypto.randomUUID();

			const put = await send("PUT", `/api/posts/${post.id}/like`, accountWithoutUser);
			const del = await send("DELETE", `/api/posts/${post.id}/like`, accountWithoutUser);

			expect(put.status).toBe(403);
			expect(await put.json()).toEqual({ message: "新規ユーザー登録が済んでいません。" });
			expect(del.status).toBe(204);
		});
	});
});
