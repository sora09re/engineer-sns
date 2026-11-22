import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser, follow } from "./fixtures";

describe("GET /api/users/:userId", () => {
	test("ユーザーを、フォロワー数とフォロー数つきで返す", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const target = await createUser(db, "target");
			const fan = await createUser(db, "fan");
			await follow(db, me.id, target.id);
			await follow(db, fan.id, target.id);
			await follow(db, target.id, me.id);

			const res = await get(`/api/users/${target.id}`, me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual({
				id: target.id,
				created_at: expect.any(String),
				name: "target",
				updated_at: expect.any(String),
				username: "target",
				follower_count: 2,
				followee_count: 1,
				is_following: true,
				can_follow: true,
			});
		});
	});

	test("フォローしていない相手なら is_following は false", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");
			const target = await createUser(db, "target");
			await follow(db, target.id, me.id);

			const res = await get(`/api/users/${target.id}`, me.id);

			expect(await res.json()).toMatchObject({ is_following: false, can_follow: true });
		});
	});

	test("自分のプロフィールは、フォローできない", async () => {
		await withRollback(async (db) => {
			const { get } = await setupApp(db);
			const me = await createUser(db, "me");

			const res = await get(`/api/users/${me.id}`, me.id);

			expect(await res.json()).toMatchObject({ is_following: false, can_follow: false });
		});
	});

	test.each(["00000000-0000-0000-0000-000000000000", "not-a-uuid"])(
		"ユーザー（%s）が存在しなければ 404",
		async (userId) => {
			await withRollback(async (db) => {
				const { get } = await setupApp(db);
				const me = await createUser(db, "me");

				const res = await get(`/api/users/${userId}`, me.id);

				expect(res.status).toBe(404);
				expect(await res.json()).toEqual({ message: "ユーザーが見つかりません。" });
			});
		},
	);
});
