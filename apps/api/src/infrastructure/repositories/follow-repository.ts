import { eq } from "drizzle-orm";

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
	};
};
