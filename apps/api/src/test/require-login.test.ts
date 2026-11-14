import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";

const id = "00000000-0000-0000-0000-000000000000";

describe("ログインが必要なエンドポイント", () => {
	test.each([
		["GET", "/api/posts/timeline"],
		["GET", `/api/posts/${id}`],
		["GET", `/api/posts/${id}/comments`],
		["GET", `/api/users/${id}/posts`],
		["GET", "/api/posts/search?q=a"],
		["POST", "/api/posts"],
		["POST", `/api/posts/${id}/comments`],
		["DELETE", `/api/posts/${id}`],
		["PUT", `/api/posts/${id}/like`],
		["DELETE", `/api/posts/${id}/like`],
		["GET", `/api/users/${id}/follow`],
		["PUT", `/api/users/${id}/follow`],
		["DELETE", `/api/users/${id}/follow`],
		["GET", `/api/users/${id}/followers`],
		["GET", `/api/users/${id}/followees`],
	])("%s %s はトークンがなければ 401", async (method, path) => {
		await withRollback(async (db) => {
			const { app } = await setupApp(db);

			const res = await app.request(path, { method });

			expect(res.status).toBe(401);
			expect(await res.json()).toEqual({ message: "ログインしていません。" });
		});
	});
});
