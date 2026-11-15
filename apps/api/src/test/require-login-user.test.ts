import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser } from "./fixtures";

/**
 * 何かを作る操作の前提の優先順位: 403（ユーザーがない）→ 404（対象がない）→ 422（入力のルール違反）。
 * どの操作でも同じ順で返ることを確かめる
 */
describe("ログイン中のユーザーとして行う操作", () => {
	const missingId = crypto.randomUUID();

	/** アカウント ID を受け取り、対象がなく、入力もルールに合わないリクエストを作る */
	const operations = (accountId: string) => {
		return [
			{ name: "投稿", method: "POST", path: "/api/posts", body: { content: " " } },
			{
				name: "コメント",
				method: "POST",
				path: `/api/posts/${missingId}/comments`,
				body: { content: " " },
			},
			{ name: "投稿の削除", method: "DELETE", path: `/api/posts/${missingId}` },
			{ name: "いいね", method: "PUT", path: `/api/posts/${missingId}/like` },
			// 自分自身（ユーザーがないので、対象としても存在しない）をフォローする
			{ name: "フォロー", method: "PUT", path: `/api/users/${accountId}/follow` },
			{ name: "ユーザーの編集", method: "PATCH", path: "/api/me", body: { name: " " } },
		];
	};

	test("ユーザーのないアカウントなら、対象がなく入力が不正でも 403", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountWithoutUser = crypto.randomUUID();

			for (const { name, method, path, body } of operations(accountWithoutUser)) {
				const res = await send(method, path, accountWithoutUser, body);
				expect({ name, status: res.status, body: await res.json() }).toEqual({
					name,
					status: 403,
					body: { message: "新規ユーザー登録が済んでいません。" },
				});
			}
		});
	});

	test("ユーザーのないアカウントなら、対象の ID が UUID の形をしていなくても 403", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const accountWithoutUser = crypto.randomUUID();
			const requests = [
				{ method: "POST", path: "/api/posts/not-a-uuid/comments", body: { content: "こんにちは" } },
				{ method: "DELETE", path: "/api/posts/not-a-uuid" },
				{ method: "PUT", path: "/api/posts/not-a-uuid/like" },
				{ method: "PUT", path: "/api/users/not-a-uuid/follow" },
			];

			for (const { method, path, body } of requests) {
				const res = await send(method, path, accountWithoutUser, body);
				expect({ path, method, status: res.status }).toEqual({ path, method, status: 403 });
			}
		});
	});

	test("ユーザーがあれば、本文が不正でも対象の投稿がないことを先に 404 で返す", async () => {
		await withRollback(async (db) => {
			const { send } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await send("POST", `/api/posts/${missingId}/comments`, me.id, {
				content: " ",
			});

			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ message: "投稿が見つかりません。" });
		});
	});
});
