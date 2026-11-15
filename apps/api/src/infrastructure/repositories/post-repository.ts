import { type SQL, and, desc, eq, ilike, inArray, isNull, sql } from "drizzle-orm";

import type { PostRepository } from "../../application/ports";
import type { PostSummary } from "../../application/post-summary";
import type { Post } from "../../domain/post";
import type { Db } from "../db/client";
import { likes, posts, users } from "../db/schema";
import { escapeLike } from "./escape-like";
import { isUuid } from "./is-uuid";
import { toUser } from "./to-user";

/** posts テーブルの行を domain の Post にする */
const toPost = (row: typeof posts.$inferSelect): Post => {
	return {
		id: row.id,
		authorId: row.userId,
		parentPostId: row.parentPostId,
		content: row.content,
		createdAt: row.createdAt,
	};
};

/** 条件に合う投稿を、投稿者・いいね・コメント数つきで新しい順に返す */
const findSummaries = async (db: Db, where: SQL | undefined): Promise<PostSummary[]> => {
	const rows = await db
		.select({
			post: posts,
			user: users,
			// サブクエリ側の posts は c と呼び、外側の "posts"."id" と区別する
			commentCount:
				sql<number>`(select count(*) from ${posts} as c where c.parent_post_id = ${posts.id})`.mapWith(
					Number,
				),
		})
		.from(posts)
		.innerJoin(users, eq(users.id, posts.userId))
		.where(where)
		.orderBy(desc(posts.createdAt));

	const postIds = rows.map((row) => row.post.id);
	const likeRows = postIds.length
		? await db.select().from(likes).where(inArray(likes.postId, postIds))
		: [];

	return rows.map(({ post, user, commentCount }) => {
		return {
			post: toPost(post),
			author: toUser(user),
			likes: likeRows
				.filter((like) => like.postId === post.id)
				.map((like) => {
					return { id: like.id, postId: like.postId, userId: like.userId };
				}),
			commentCount,
		};
	});
};

const findSummaryById = async (db: Db, postId: string) => {
	const [summary] = await findSummaries(db, eq(posts.id, postId));
	return summary ?? null;
};

export const createPostRepository = (db: Db): PostRepository => {
	return {
		findById: async (postId) => {
			if (!isUuid(postId)) {
				return null;
			}
			const [row] = await db.select().from(posts).where(eq(posts.id, postId));
			return row ? toPost(row) : null;
		},
		findSummaryById: async (postId) => {
			return isUuid(postId) ? findSummaryById(db, postId) : null;
		},
		findTopLevelByAuthors: (authorIds) => {
			return findSummaries(db, and(isNull(posts.parentPostId), inArray(posts.userId, authorIds)));
		},
		findCommentsOf: async (postId) => {
			if (!isUuid(postId)) {
				return [];
			}
			return findSummaries(db, eq(posts.parentPostId, postId));
		},
		findByAuthor: async (authorId) => {
			if (!isUuid(authorId)) {
				return [];
			}
			return findSummaries(db, eq(posts.userId, authorId));
		},
		searchTopLevel: (keyword) => {
			return findSummaries(
				db,
				and(isNull(posts.parentPostId), ilike(posts.content, `%${escapeLike(keyword)}%`)),
			);
		},
		create: async ({ authorId, content, parentPostId }) => {
			const [row] = await db
				.insert(posts)
				.values({ userId: authorId, content, parentPostId })
				.returning();
			const summary = await findSummaryById(db, row!.id);
			if (!summary) {
				throw new Error(`作成した投稿（${row!.id}）が見つかりません。`);
			}
			return summary;
		},
		delete: async (postId) => {
			// コメント（parent_post_id で参照する投稿）は DB の on delete cascade で消える
			await db.delete(posts).where(eq(posts.id, postId));
		},
	};
};
