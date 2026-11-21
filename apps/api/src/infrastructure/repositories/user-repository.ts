import { asc, eq, ilike, or, sql } from "drizzle-orm";

import type { UserRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { follows, users } from "../db/schema";
import { escapeLike } from "./escape-like";
import { isUuid } from "./is-uuid";
import { toUser } from "./to-user";

const outerUserId = sql`${users}.${sql.identifier("id")}`;

const followOrder = [asc(follows.createdAt), asc(users.username)];

export const createUserRepository = (db: Db): UserRepository => {
	return {
		exists: async (userId) => {
			if (!isUuid(userId)) {
				return false;
			}
			const rows = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
			return rows.length > 0;
		},
		findById: async (userId) => {
			if (!isUuid(userId)) {
				return null;
			}
			const [row] = await db.select().from(users).where(eq(users.id, userId));
			return row ? toUser(row) : null;
		},
		findProfile: async (userId) => {
			if (!isUuid(userId)) {
				return null;
			}
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
		findFollowersOf: async (userId) => {
			if (!isUuid(userId)) {
				return [];
			}
			const rows = await db
				.select({ user: users })
				.from(follows)
				.innerJoin(users, eq(users.id, follows.followerId))
				.where(eq(follows.followeeId, userId))
				.orderBy(...followOrder);
			return rows.map((row) => toUser(row.user));
		},
		findFolloweesOf: async (userId) => {
			if (!isUuid(userId)) {
				return [];
			}
			const rows = await db
				.select({ user: users })
				.from(follows)
				.innerJoin(users, eq(users.id, follows.followeeId))
				.where(eq(follows.followerId, userId))
				.orderBy(...followOrder);
			return rows.map((row) => toUser(row.user));
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
		findIdByUsername: async (username) => {
			const [row] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.username, username));
			return row?.id ?? null;
		},
		create: async (values) => {
			const [row] = await db.insert(users).values(values).returning();
			return toUser(row!);
		},
		update: async (userId, values) => {
			const changes = Object.fromEntries(
				Object.entries(values).filter(([, value]) => value !== undefined),
			);
			const [row] =
				Object.keys(changes).length > 0
					? await db.update(users).set(changes).where(eq(users.id, userId)).returning()
					: await db.select().from(users).where(eq(users.id, userId));
			if (!row) {
				throw new Error(`ユーザー（${userId}）が見つかりません。`);
			}
			return toUser(row);
		},
	};
};
