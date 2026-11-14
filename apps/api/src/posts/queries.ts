import type { PostType, User } from "@engineer-sns/shared";
import { type SQL, desc, eq, inArray, sql } from "drizzle-orm";

import type { Db } from "../db/client";
import { likes, posts, users } from "../db/schema";

export const toUser = (row: typeof users.$inferSelect): User => {
	return {
		id: row.id,
		bio: row.bio ?? undefined,
		created_at: row.createdAt.toISOString(),
		email: row.email,
		location: row.location ?? undefined,
		name: row.name,
		profile_image_url: row.profileImageUrl ?? undefined,
		updated_at: row.updatedAt.toISOString(),
		username: row.username,
		website: row.website ?? undefined,
	};
};

/** 条件に合う投稿を、投稿者・いいね・コメント数つきで新しい順に返す */
export const findPosts = async (db: Db, where: SQL | undefined): Promise<PostType[]> => {
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
			id: post.id,
			comment_count: commentCount,
			content: post.content,
			created_at: post.createdAt.toISOString(),
			likes: likeRows
				.filter((like) => like.postId === post.id)
				.map((like) => {
					return { id: like.id, post_id: like.postId, user_id: like.userId };
				}),
			parent_post_id: post.parentPostId,
			user_id: post.userId,
			users: toUser(user),
		};
	});
};
