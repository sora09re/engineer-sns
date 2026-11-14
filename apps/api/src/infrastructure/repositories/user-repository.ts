import { eq } from "drizzle-orm";
import postgres from "postgres";

import { ConflictError } from "../../application/errors";
import type { UserRepository } from "../../application/ports";
import type { Db } from "../db/client";
import { users } from "../db/schema";
import { toUser } from "./to-user";

/**
 * ユーザーネームの一意制約に反したら ConflictError にする。
 * application でも先に確かめるが、確かめてから書くまでの間にほかの登録が割り込むことがある
 */
const rethrowUsernameConflict = (error: unknown): never => {
	const cause = error instanceof Error ? error.cause : undefined;
	if (
		cause instanceof postgres.PostgresError &&
		cause.code === "23505" &&
		cause.constraint_name === "users_username_key"
	) {
		throw new ConflictError("このユーザーネームはすでに使われています。");
	}
	throw error;
};

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
			const [row] = await db
				.insert(users)
				.values(values)
				.returning()
				.catch(rethrowUsernameConflict);
			return toUser(row!);
		},
		update: async (userId, values) => {
			const changes = Object.fromEntries(
				Object.entries(values).filter(([, value]) => value !== undefined),
			);
			// 変える項目がなければ、update ではなくいまの行を返す（drizzle は空の set を受け付けない）
			const [row] =
				Object.keys(changes).length > 0
					? await db
							.update(users)
							.set(changes)
							.where(eq(users.id, userId))
							.returning()
							.catch(rethrowUsernameConflict)
					: await db.select().from(users).where(eq(users.id, userId));
			if (!row) {
				throw new Error(`ユーザー（${userId}）が見つかりません。`);
			}
			return toUser(row);
		},
	};
};
