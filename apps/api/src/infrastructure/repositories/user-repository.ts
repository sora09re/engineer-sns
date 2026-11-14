import { eq } from "drizzle-orm";

import type { UserRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { users } from "../db/schema";

export const createUserRepository = (db: Db): UserRepository => {
	return {
		exists: async (userId) => {
			const rows = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
			return rows.length > 0;
		},
	};
};
