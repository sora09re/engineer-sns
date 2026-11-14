import type { User } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp } from "./app";
import { withRollback } from "./db";
import { createUser, follow } from "./fixtures";

const setup = async (db: Parameters<typeof setupApp>[0]) => {
	const app = await setupApp(db);
	const me = await createUser(db, "me");
	const target = await createUser(db, "target");
	const isFollowing = async (accountId: string, userId: string) => {
		const res = await app.get(`/api/users/${userId}/follow`, accountId);
		return ((await res.json()) as { following: boolean }).following;
	};
	/** 一覧のユーザー名を並び順どおりに取り出す */
	const usernames = async (path: string) => {
		const res = await app.get(path, me.id);
		return ((await res.json()) as User[]).map((user) => user.username);
	};
	return { ...app, me, target, isFollowing, usernames };
};

describe("PUT /api/users/:userId/follow", () => {
	test("フォローでき、204 を返す。フォロー状態が true になる", async () => {
		await withRollback(async (db) => {
			const { send, me, target, isFollowing } = await setup(db);

			const res = await send("PUT", `/api/users/${target.id}/follow`, me.id);

			expect(res.status).toBe(204);
			expect(await isFollowing(me.id, target.id)).toBe(true);
		});
	});

	test("フォローすると、相手のフォロワー一覧と自分のフォロー一覧に入る", async () => {
		await withRollback(async (db) => {
			const { send, me, target, usernames } = await setup(db);

			await send("PUT", `/api/users/${target.id}/follow`, me.id);

			expect(await usernames(`/api/users/${target.id}/followers`)).toEqual(["me"]);
			expect(await usernames(`/api/users/${me.id}/followees`)).toEqual(["target"]);
		});
	});

	test("すでにフォローしていても 204 で、フォローは 1 つのまま", async () => {
		await withRollback(async (db) => {
			const { send, me, target, usernames } = await setup(db);
			await send("PUT", `/api/users/${target.id}/follow`, me.id);

			const res = await send("PUT", `/api/users/${target.id}/follow`, me.id);

			expect(res.status).toBe(204);
			expect(await usernames(`/api/users/${target.id}/followers`)).toEqual(["me"]);
		});
	});

	test("自分自身はフォローできず、422 を返す", async () => {
		await withRollback(async (db) => {
			const { send, me, isFollowing } = await setup(db);

			const res = await send("PUT", `/api/users/${me.id}/follow`, me.id);

			expect(res.status).toBe(422);
			expect(await res.json()).toEqual({ message: "自分はフォローできません。" });
			expect(await isFollowing(me.id, me.id)).toBe(false);
		});
	});
});

describe("DELETE /api/users/:userId/follow", () => {
	test("フォローを外せて、204 を返す。フォロー状態が false になる", async () => {
		await withRollback(async (db) => {
			const { send, me, target, isFollowing } = await setup(db);
			await send("PUT", `/api/users/${target.id}/follow`, me.id);

			const res = await send("DELETE", `/api/users/${target.id}/follow`, me.id);

			expect(res.status).toBe(204);
			expect(await isFollowing(me.id, target.id)).toBe(false);
		});
	});

	test("フォローしていない相手でも 204", async () => {
		await withRollback(async (db) => {
			const { send, me, target } = await setup(db);

			const res = await send("DELETE", `/api/users/${target.id}/follow`, me.id);

			expect(res.status).toBe(204);
		});
	});

	test("外れるのは自分のフォローだけで、ほかの人の同じ相手へのフォローは残る", async () => {
		await withRollback(async (db) => {
			const { send, me, target, usernames } = await setup(db);
			const other = await createUser(db, "other");
			await send("PUT", `/api/users/${target.id}/follow`, me.id);
			await send("PUT", `/api/users/${target.id}/follow`, other.id);

			await send("DELETE", `/api/users/${target.id}/follow`, me.id);

			expect(await usernames(`/api/users/${target.id}/followers`)).toEqual(["other"]);
		});
	});
});

describe("相手のユーザーが存在しないとき", () => {
	const ids = ["00000000-0000-0000-0000-000000000000", "not-a-uuid"];

	test.each(
		["GET", "PUT", "DELETE"].flatMap((method) => ids.map((userId) => [method, userId] as const)),
	)("%s /follow: ユーザー（%s）が存在しなければ 404", async (method, userId) => {
		await withRollback(async (db) => {
			const { send, me } = await setup(db);

			const res = await send(method, `/api/users/${userId}/follow`, me.id);

			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ message: "ユーザーが見つかりません。" });
		});
	});

	test.each(
		["followers", "followees"].flatMap((list) => ids.map((userId) => [list, userId] as const)),
	)("%s: ユーザー（%s）が存在しなければ空", async (list, userId) => {
		await withRollback(async (db) => {
			const { get, me } = await setup(db);

			const res = await get(`/api/users/${userId}/${list}`, me.id);

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual([]);
		});
	});
});

describe("ユーザーのないアカウント（新規ユーザー登録の前）", () => {
	test("PUT は 403、DELETE は外すフォローがないので 204、フォロー状態は false", async () => {
		await withRollback(async (db) => {
			const { send, target, isFollowing } = await setup(db);
			const accountWithoutUser = crypto.randomUUID();

			const put = await send("PUT", `/api/users/${target.id}/follow`, accountWithoutUser);
			const del = await send("DELETE", `/api/users/${target.id}/follow`, accountWithoutUser);

			expect(put.status).toBe(403);
			expect(await put.json()).toEqual({ message: "新規ユーザー登録が済んでいません。" });
			expect(del.status).toBe(204);
			expect(await isFollowing(accountWithoutUser, target.id)).toBe(false);
		});
	});
});

describe("一覧の並び順", () => {
	test("フォローした順（古い順）に並ぶ", async () => {
		await withRollback(async (db) => {
			const { me, target, usernames } = await setup(db);
			const amy = await createUser(db, "amy");
			const zed = await createUser(db, "zed");
			await follow(db, amy.id, target.id, "2026-01-02T00:00:00Z");
			await follow(db, zed.id, target.id, "2026-01-01T00:00:00Z");
			await follow(db, me.id, amy.id, "2026-01-02T00:00:00Z");
			await follow(db, me.id, zed.id, "2026-01-01T00:00:00Z");

			expect(await usernames(`/api/users/${target.id}/followers`)).toEqual(["zed", "amy"]);
			expect(await usernames(`/api/users/${me.id}/followees`)).toEqual(["zed", "amy"]);
		});
	});

	test("フォローした時刻が同じなら、ユーザー名順に並ぶ", async () => {
		await withRollback(async (db) => {
			const { me, target, usernames } = await setup(db);
			const zed = await createUser(db, "zed");
			const amy = await createUser(db, "amy");
			await follow(db, zed.id, target.id, "2026-01-01T00:00:00Z");
			await follow(db, amy.id, target.id, "2026-01-01T00:00:00Z");
			await follow(db, me.id, zed.id, "2026-01-01T00:00:00Z");
			await follow(db, me.id, amy.id, "2026-01-01T00:00:00Z");

			expect(await usernames(`/api/users/${target.id}/followers`)).toEqual(["amy", "zed"]);
			expect(await usernames(`/api/users/${me.id}/followees`)).toEqual(["amy", "zed"]);
		});
	});
});
