import type { User } from "../../domain/user";
import type { users } from "../db/schema";

/** users テーブルの行を domain の User にする */
export const toUser = (row: typeof users.$inferSelect): User => {
	return {
		id: row.id,
		name: row.name,
		username: row.username,
		email: row.email,
		bio: row.bio ?? undefined,
		location: row.location ?? undefined,
		website: row.website ?? undefined,
		profileImageUrl: row.profileImageUrl ?? undefined,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
};
