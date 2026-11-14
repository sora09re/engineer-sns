import { asc, eq, ilike, or, sql } from "drizzle-orm";

import type { UserQuery } from "../../application/ports";
import type { Db } from "../db/client";
import { follows, users } from "../db/schema";
import { escapeLike } from "./escape-like";
import { toUser } from "./to-user";

/**
 * サブクエリから外側の users.id を指す。JOIN のない select では ${users.id} が表名なしの "id" になり、
 * サブクエリの中の f.id と取り違えるので、表名つきで書く
 */
const outerUserId = sql`${users}.${sql.identifier("id")}`;

/** フォローした順（古い順）。同じ時刻ならユーザー名順 */
const followOrder = [asc(follows.createdAt), asc(users.username)];

export const createUserQuery = (db: Db): UserQuery => {
	return {
		findById: async (userId) => {
			const [row] = await db.select().from(users).where(eq(users.id, userId));
			return row ? toUser(row) : null;
		},
		findProfile: async (userId) => {
			const [row] = await db
				.select({
					user: users,
					followerCount:
						sql<number>`(select count(*) from ${follows} as f where f.followee_id = ${outerUserId})`.mapWith(
							Number,
						),
					followeeCount:
						sql<number>`(select count(*) from ${follows} as f where f.follower_id = ${outerUserId})`.mapWith(
							Number,
						),
				})
				.from(users)
				.where(eq(users.id, userId));
			if (!row) {
				return null;
			}
			return {
				user: toUser(row.user),
				followerCount: row.followerCount,
				followeeCount: row.followeeCount,
			};
		},
		search: async (keyword) => {
			const pattern = `%${escapeLike(keyword)}%`;
			const rows = await db
				.select()
				.from(users)
				.where(
					or(ilike(users.name, pattern), ilike(users.username, pattern), ilike(users.bio, pattern)),
				)
				.orderBy(asc(users.username));
			return rows.map(toUser);
		},
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
