import type { UserView } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp, uniqueWord } from "./app";
import { withRollback } from "./db";
import { createUser, follow } from "./fixtures";

type Viewer = "ほかのユーザー" | "本人" | "ユーザーのないアカウント";

describe("ユーザーの読み取りの can_follow は、フォローの API が通るかどうかと一致する", () => {
	test.each<Viewer>(["ほかのユーザー", "本人", "ユーザーのないアカウント"])(
		"見る人が%s",
		async (viewer) => {
			await withRollback(async (db) => {
				const { get, send } = await setupApp(db);
				const word = uniqueWord();
				const target = await createUser(db, `${word}_target`);
				const hub = await createUser(db, "hub");
				const other = await createUser(db, "other");
				await follow(db, target.id, hub.id);
				await follow(db, hub.id, target.id);
				const accountId = {
					ほかのユーザー: other.id,
					本人: target.id,
					ユーザーのないアカウント: crypto.randomUUID(),
				}[viewer];

				const readers = {
					プロフィール: async () => (await get(`/api/users/${target.id}`, accountId)).json(),
					検索: async () => (await get(`/api/users/search?q=${word}`, accountId)).json(),
					フォロワー一覧: async () =>
						(await get(`/api/users/${hub.id}/followers`, accountId)).json(),
					フォロー一覧: async () => (await get(`/api/users/${hub.id}/followees`, accountId)).json(),
				};
				const canFollow: Record<string, boolean> = {};
				for (const [name, read] of Object.entries(readers)) {
					const body = (await read()) as UserView | UserView[];
					const user = Array.isArray(body) ? body.find((u) => u.id === target.id) : body;
					canFollow[name] = user!.can_follow;
				}
				const res = await send("PUT", `/api/users/${target.id}/follow`, accountId);
				const followable = res.status === 204;

				expect(canFollow).toEqual(
					Object.fromEntries(Object.keys(readers).map((name) => [name, followable])),
				);
			});
		},
	);
});
