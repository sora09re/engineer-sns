import { and, eq } from "drizzle-orm";

import type { FollowRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { follows } from "../db/schema";

export const createFollowRepository = (db: Db): FollowRepository => {
	return {
		findFolloweeIds: async (followerId) => {
			const rows = await db
				.select({ followeeId: follows.followeeId })
				.from(follows)
				.where(eq(follows.followerId, followerId));
			return rows.map((row) => row.followeeId);
		},
		exists: async ({ followerId, followeeId }) => {
			const rows = await db
				.select({ id: follows.id })
				.from(follows)
				.where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
			return rows.length > 0;
		},
		add: async ({ followerId, followeeId }) => {
			// 同じ相手へのフォローは 1 つ（一意制約）。すでにあれば何もしない
			await db.insert(follows).values({ followerId, followeeId }).onConflictDoNothing();
		},
		remove: async ({ followerId, followeeId }) => {
			await db
				.delete(follows)
				.where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
		},
	};
};
