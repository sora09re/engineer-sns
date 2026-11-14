import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import type { PostQuery } from "../../application/ports";
import type { User } from "../../domain/user";
import type { Db } from "../db/client";
import { likes, posts, users } from "../db/schema";

const toUser = (row: typeof users.$inferSelect): User => {
	return {
		id: row.id,
		name: row.name,
		username: row.username,
		email: row.email,
		bio: row.bio ?? undefined,
		location: row.location ?? undefined,
		website: row.website ?? undefined,
		profileImageUrl: row.profileImageUrl ?? undefined,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
};

export const createDrizzlePostQuery = (db: Db): PostQuery => {
	return {
		findTopLevelByAuthors: async (authorIds) => {
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
				.where(and(isNull(posts.parentPostId), inArray(posts.userId, authorIds)))
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
		},
	};
};
