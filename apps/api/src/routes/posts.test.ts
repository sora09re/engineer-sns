import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { createApp } from "../app";
import type { Db } from "../db/client";
import { createTestKeys } from "../test/auth";
import { withRollback } from "../test/db";
import { createPost, createUser, follow, like } from "../test/fixtures";

/** レスポンスの投稿の本文だけを並び順どおりに取り出す */
const contentsOf = async (res: Response) => {
	const posts = (await res.json()) as PostType[];
	return posts.map((post) => post.content);
};

const setup = async (db: Db) => {
	const keys = await createTestKeys();
	const app = createApp({ db, jwks: keys.jwks });

	const getTimeline = async (accountId: string) => {
		const token = await keys.sign({ sub: accountId });
		return app.request("/api/posts/timeline", {
			headers: { Authorization: `Bearer ${token}` },
		});
	};

	return { app, getTimeline, ...keys };
};

describe("GET /api/posts/timeline", () => {
	test("トークンがなければ 401", async () => {
		await withRollback(async (db) => {
			const { app } = await setup(db);

			const res = await app.request("/api/posts/timeline");

			expect(res.status).toBe(401);
			expect(await res.json()).toEqual({ message: "ログインしていません。" });
		});
	});

	test("ほかの鍵で署名されたトークンなら 401", async () => {
		await withRollback(async (db) => {
			const { app } = await setup(db);
			const other = await createTestKeys();
			const token = await other.sign({ sub: crypto.randomUUID() });

			const res = await app.request("/api/posts/timeline", {
				headers: { Authorization: `Bearer ${token}` },
			});

			expect(res.status).toBe(401);
		});
	});

	test("有効期限が切れたトークンなら 401", async () => {
		await withRollback(async (db) => {
			const { app, sign } = await setup(db);
			const token = await sign({ sub: crypto.randomUUID(), expiresIn: "-1m" });

			const res = await app.request("/api/posts/timeline", {
				headers: { Authorization: `Bearer ${token}` },
			});

			expect(res.status).toBe(401);
		});
	});

	test("自分の投稿が返る", async () => {
		await withRollback(async (db) => {
			const { getTimeline } = await setup(db);
			const me = await createUser(db, "me");
			await createPost(db, { userId: me.id, content: "はじめての投稿" });

			const res = await getTimeline(me.id);

			expect(res.status).toBe(200);
			expect(await contentsOf(res)).toEqual(["はじめての投稿"]);
		});
	});

	test("フォローしているユーザーの投稿も返り、フォローしていないユーザーの投稿は返らない", async () => {
		await withRollback(async (db) => {
			const { getTimeline } = await setup(db);
			const me = await createUser(db, "me");
			const followee = await createUser(db, "followee");
			const stranger = await createUser(db, "stranger");
			await follow(db, me.id, followee.id);
			// フォローされているだけの相手は含めない（向きを取り違えていないか）
			await follow(db, stranger.id, me.id);
			await createPost(db, { userId: followee.id, content: "フォローしている人の投稿" });
			await createPost(db, { userId: stranger.id, content: "知らない人の投稿" });

			const res = await getTimeline(me.id);

			expect(await contentsOf(res)).toEqual(["フォローしている人の投稿"]);
		});
	});

	test("コメントは含まれない", async () => {
		await withRollback(async (db) => {
			const { getTimeline } = await setup(db);
			const me = await createUser(db, "me");
			const post = await createPost(db, { userId: me.id, content: "親の投稿" });
			await createPost(db, { userId: me.id, content: "コメント", parentPostId: post.id });

			const res = await getTimeline(me.id);

			expect(await contentsOf(res)).toEqual(["親の投稿"]);
		});
	});

	test("新しい順に並ぶ", async () => {
		await withRollback(async (db) => {
			const { getTimeline } = await setup(db);
			const me = await createUser(db, "me");
			const followee = await createUser(db, "followee");
			await follow(db, me.id, followee.id);
			await createPost(db, { userId: me.id, content: "2番目", createdAt: "2026-01-02T00:00:00Z" });
			await createPost(db, {
				userId: followee.id,
				content: "最新",
				createdAt: "2026-01-03T00:00:00Z",
			});
			await createPost(db, {
				userId: followee.id,
				content: "最古",
				createdAt: "2026-01-01T00:00:00Z",
			});

			const res = await getTimeline(me.id);

			expect(await contentsOf(res)).toEqual(["最新", "2番目", "最古"]);
		});
	});

	test("投稿者のユーザー、いいね、コメント数を含む", async () => {
		await withRollback(async (db) => {
			const { getTimeline } = await setup(db);
			const me = await createUser(db, "me");
			const fan = await createUser(db, "fan");
			const post = await createPost(db, {
				userId: me.id,
				content: "```ts\nconsole.log(1)\n```",
				createdAt: "2026-01-02T03:04:05Z",
			});
			await createPost(db, { userId: fan.id, content: "コメント1", parentPostId: post.id });
			await createPost(db, { userId: fan.id, content: "コメント2", parentPostId: post.id });
			const fanLike = await like(db, fan.id, post.id);

			const res = await getTimeline(me.id);

			expect(await res.json()).toEqual([
				{
					id: post.id,
					comment_count: 2,
					content: "```ts\nconsole.log(1)\n```",
					created_at: "2026-01-02T03:04:05.000Z",
					likes: [{ id: fanLike.id, post_id: post.id, user_id: fan.id }],
					parent_post_id: null,
					user_id: me.id,
					users: {
						id: me.id,
						created_at: expect.any(String),
						email: "me@example.com",
						name: "me",
						updated_at: expect.any(String),
						username: "me",
					},
				},
			]);
		});
	});
});
