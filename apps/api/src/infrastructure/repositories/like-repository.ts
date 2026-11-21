import { and, eq } from "drizzle-orm";

import type { LikeRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { likes } from "../db/schema";

export const createLikeRepository = (db: Db): LikeRepository => {
	return {
		add: async ({ postId, userId }) => {
			await db.insert(likes).values({ postId, userId }).onConflictDoNothing();
		},
		remove: async ({ postId, userId }) => {
			await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
		},
	};
};
