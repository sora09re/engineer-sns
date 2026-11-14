import { eq } from "drizzle-orm";

import type { UserRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { users } from "../db/schema";
import { toUser } from "./to-user";

export const createUserRepository = (db: Db): UserRepository => {
	return {
		exists: async (userId) => {
			const rows = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
			return rows.length > 0;
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
			// 変える項目がなければ、update ではなくいまの行を返す（drizzle は空の set を受け付けない）
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
