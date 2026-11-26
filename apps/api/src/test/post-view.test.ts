import type { PostType } from "@engineer-sns/shared";
import { describe, expect, test } from "vite-plus/test";

import { setupApp, uniqueWord } from "./app";
import { withRollback } from "./db";
import { createPost, createUser, follow, like } from "./fixtures";

const setup = async (db: Parameters<typeof setupApp>[0]) => {
	const app = await setupApp(db);
	const me = await createUser(db, "me");
	const author = await createUser(db, "author");
	const word = uniqueWord();
	const post = await createPost(db, { userId: author.id, content: `${word} の投稿` });
	const comment = await createPost(db, {
		userId: me.id,
		content: "わたしのコメント",
		parentPostId: post.id,
	});
	await follow(db, me.id, author.id);
	await like(db, me.id, post.id);
	const viewOf = async (path: string, accountId: string, postId: string) => {
		const body = (await (await app.get(path, accountId)).json()) as PostType | PostType[];
		const found = (Array.isArray(body) ? body : [body]).find((item) => item.id === postId);
		if (!found) {
			throw new Error(`${path} に投稿 ${postId} がない`);
		}
		const { is_liked, like_count, can_delete } = found;
		return { is_liked, like_count, can_delete };
	};
	return { me, author, word, post, comment, viewOf };
};

describe("投稿を返す API は、ログイン中のユーザーから見た値を返す", () => {
	test.each([
		["タイムライン", () => "/api/posts/timeline"],
		["検索", (word: string) => `/api/posts/search?${new URLSearchParams({ q: word })}`],
		["詳細", (_word: string, postId: string) => `/api/posts/${postId}`],
		[
			"ユーザーの投稿",
			(_word: string, _postId: string, authorId: string) => `/api/users/${authorId}/posts`,
		],
	])("%s: いいねした人にはいいね済み、投稿した人には削除できる", async (_name, pathOf) => {
		await withRollback(async (db) => {
			const { me, author, word, post, viewOf } = await setup(db);
			const path = pathOf(word, post.id, author.id);

			expect(await viewOf(path, me.id, post.id)).toEqual({
				is_liked: true,
				like_count: 1,
				can_delete: false,
			});
			expect(await viewOf(path, author.id, post.id)).toEqual({
				is_liked: false,
				like_count: 1,
				can_delete: true,
			});
		});
	});

	test("コメント: コメントした人には削除でき、投稿した人には削除できない", async () => {
		await withRollback(async (db) => {
			const { me, author, post, comment, viewOf } = await setup(db);
			const path = `/api/posts/${post.id}/comments`;

			expect(await viewOf(path, me.id, comment.id)).toEqual({
				is_liked: false,
				like_count: 0,
				can_delete: true,
			});
			expect(await viewOf(path, author.id, comment.id)).toEqual({
				is_liked: false,
				like_count: 0,
				can_delete: false,
			});
		});
	});

	test("ユーザーのないアカウント（新規ユーザー登録の前）には、いいね済みでも削除できるでもない", async () => {
		await withRollback(async (db) => {
			const { post, viewOf } = await setup(db);

			expect(await viewOf(`/api/posts/${post.id}`, crypto.randomUUID(), post.id)).toEqual({
				is_liked: false,
				like_count: 1,
				can_delete: false,
			});
		});
	});
});
