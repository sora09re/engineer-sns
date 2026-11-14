import { eq } from "drizzle-orm";

import type { PostRepository } from "../../application/ports";
import type { Post } from "../../domain/post";
import type { Db } from "../db/client";
import { posts } from "../db/schema";

const toPost = (row: typeof posts.$inferSelect): Post => {
	return {
		id: row.id,
		authorId: row.userId,
		parentPostId: row.parentPostId,
		content: row.content,
		createdAt: row.createdAt,
	};
};

export const createPostRepository = (db: Db): PostRepository => {
	return {
		findById: async (postId) => {
			const [row] = await db.select().from(posts).where(eq(posts.id, postId));
			return row ? toPost(row) : null;
		},
		create: async ({ authorId, content, parentPostId }) => {
			const [row] = await db
				.insert(posts)
				.values({ userId: authorId, content, parentPostId })
				.returning();
			return toPost(row!);
		},
		delete: async (postId) => {
			// コメント（parent_post_id で参照する投稿）は DB の on delete cascade で消える
			await db.delete(posts).where(eq(posts.id, postId));
		},
	};
};
