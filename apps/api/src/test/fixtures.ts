/**
 * テストの準備用に、DB へ直接データを入れる。書き込みの API ができたら、そちらで準備するように置き換える。
 * 結果の確認には使わない（確認は必ず API のレスポンスで行う）。
 */
import { sql } from "drizzle-orm";

import type { Db } from "../infrastructure/db/client";
import { follows, likes, posts, users } from "../infrastructure/db/schema";

/** アカウント（auth.users）だけを作る。新規ユーザー登録の前の状態 */
export const createAccount = async (db: Db, email: string) => {
	const id = crypto.randomUUID();
	await db.execute(sql`
		insert into auth.users (
			instance_id, id, aud, role, email, email_confirmed_at,
			raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
			confirmation_token, recovery_token, email_change_token_new, email_change
		) values (
			'00000000-0000-0000-0000-000000000000', ${id}, 'authenticated', 'authenticated', ${email}, now(),
			'{}'::jsonb, '{}'::jsonb, now(), now(), '', '', '', ''
		)
	`);
	return id;
};

/** アカウント（auth.users）とユーザーを作る */
export const createUser = async (db: Db, username: string) => {
	const email = `${username}@example.com`;
	const id = await createAccount(db, email);
	const [user] = await db.insert(users).values({ id, email, name: username, username }).returning();
	return user!;
};

export const createPost = async (
	db: Db,
	values: { userId: string; content: string; parentPostId?: string; createdAt?: string },
) => {
	const { createdAt, ...rest } = values;
	const [post] = await db
		.insert(posts)
		.values({ ...rest, ...(createdAt ? { createdAt: new Date(createdAt) } : {}) })
		.returning();
	return post!;
};

export const follow = async (
	db: Db,
	followerId: string,
	followeeId: string,
	createdAt?: string,
) => {
	await db
		.insert(follows)
		.values({ followerId, followeeId, ...(createdAt ? { createdAt: new Date(createdAt) } : {}) });
};

export const like = async (db: Db, userId: string, postId: string) => {
	const [row] = await db.insert(likes).values({ userId, postId }).returning();
	return row!;
};
