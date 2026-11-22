import type { PostType } from "@engineer-sns/shared";
import { and, eq, sql } from "drizzle-orm";

import type { Db } from "../infrastructure/db/client";
import { follows, posts, users } from "../infrastructure/db/schema";
import { setupApp } from "./app";

const apps = new WeakMap<Db, ReturnType<typeof setupApp>>();

const request = async (db: Db, method: string, path: string, accountId: string, body?: unknown) => {
	let app = apps.get(db);
	if (!app) {
		app = setupApp(db);
		apps.set(db, app);
	}
	const res = await (await app).send(method, path, accountId, body);
	if (!res.ok) {
		throw new Error(`準備の ${method} ${path} が ${res.status} を返した: ${await res.text()}`);
	}
	return res;
};

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
	const path = values.parentPostId ? `/api/posts/${values.parentPostId}/comments` : "/api/posts";
	const res = await request(db, "POST", path, values.userId, { content: values.content });
	const post = (await res.json()) as PostType;
	if (values.createdAt) {
		const createdAt = new Date(values.createdAt);
		await db.update(posts).set({ createdAt }).where(eq(posts.id, post.id));
		return { ...post, created_at: createdAt.toISOString() };
	}
	return post;
};

export const follow = async (
	db: Db,
	followerId: string,
	followeeId: string,
	createdAt?: string,
) => {
	await request(db, "PUT", `/api/users/${followeeId}/follow`, followerId);
	if (createdAt) {
		await db
			.update(follows)
			.set({ createdAt: new Date(createdAt) })
			.where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
	}
};

export const like = async (db: Db, userId: string, postId: string) => {
	await request(db, "PUT", `/api/posts/${postId}/like`, userId);
};

export const updateProfile = async (
	db: Db,
	userId: string,
	values: { name?: string; bio?: string },
) => {
	await request(db, "PATCH", "/api/me", userId, values);
};
