import { asc, eq } from "drizzle-orm";

import type { UserQuery } from "../../application/ports";
import type { Db } from "../db/client";
import { follows, users } from "../db/schema";
import { toUser } from "./to-user";

/** フォローした順（古い順）。同じ時刻ならユーザー名順 */
const followOrder = [asc(follows.createdAt), asc(users.username)];

export const createUserQuery = (db: Db): UserQuery => {
	return {
		findFollowersOf: async (userId) => {
			const rows = await db
				.select({ user: users })
				.from(follows)
				.innerJoin(users, eq(users.id, follows.followerId))
				.where(eq(follows.followeeId, userId))
				.orderBy(...followOrder);
			return rows.map((row) => toUser(row.user));
		},
		findFolloweesOf: async (userId) => {
			const rows = await db
				.select({ user: users })
				.from(follows)
				.innerJoin(users, eq(users.id, follows.followeeId))
				.where(eq(follows.followerId, userId))
				.orderBy(...followOrder);
			return rows.map((row) => toUser(row.user));
		},
	};
};
