import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";

const id = "00000000-0000-0000-0000-000000000000";

describe("ログインが必要なエンドポイント", () => {
	test.each([
		"/api/posts/timeline",
		`/api/posts/${id}`,
		`/api/posts/${id}/comments`,
		`/api/users/${id}/posts`,
		"/api/posts/search?q=a",
	])("%s はトークンがなければ 401", async (path) => {
		await withRollback(async (db) => {
			const { app } = await setupApp(db);

			const res = await app.request(path);

			expect(res.status).toBe(401);
			expect(await res.json()).toEqual({ message: "ログインしていません。" });
		});
	});
});
