import { type SQL, and, desc, eq, ilike, inArray, isNull, sql } from "drizzle-orm";

import type { PostQuery } from "../../application/ports";
import type { PostSummary } from "../../application/post-summary";
import type { Db } from "../db/client";
import { likes, posts, users } from "../db/schema";
import { toUser } from "./to-user";

/** LIKE のパターンで特別な意味を持つ文字（\ % _）を、文字そのものとして一致させる */
const escapeLike = (value: string) => {
	return value.replace(/[\\%_]/g, (char) => `\\${char}`);
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
			post: {
				id: post.id,
				authorId: post.userId,
				parentPostId: post.parentPostId,
				content: post.content,
				createdAt: post.createdAt,
			},
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

export const createPostQuery = (db: Db): PostQuery => {
	return {
		findTopLevelByAuthors: (authorIds) => {
			return findSummaries(db, and(isNull(posts.parentPostId), inArray(posts.userId, authorIds)));
		},
		findById: async (postId) => {
			const [summary] = await findSummaries(db, eq(posts.id, postId));
			return summary ?? null;
		},
		findCommentsOf: (postId) => {
			return findSummaries(db, eq(posts.parentPostId, postId));
		},
		findByAuthor: (authorId) => {
			return findSummaries(db, eq(posts.userId, authorId));
		},
		searchTopLevel: (keyword) => {
			return findSummaries(
				db,
				and(isNull(posts.parentPostId), ilike(posts.content, `%${escapeLike(keyword)}%`)),
			);
		},
	};
};
