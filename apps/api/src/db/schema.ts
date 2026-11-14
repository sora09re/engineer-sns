/**
 * Drizzle のスキーマ。正は supabase/migrations の SQL で、ここはそれを API から使うための写し。
 * テーブルや列を変えたら、マイグレーションと合わせてここも直す。
 * 制約や RLS のポリシーは SQL 側にあるので、ここには型に必要なものだけを書く。
 */
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
};

export const users = pgTable("users", {
	id: uuid().primaryKey(),
	name: text().notNull(),
	username: text().notNull().unique(),
	email: text().notNull(),
	bio: text(),
	location: text(),
	website: text(),
	profileImageUrl: text("profile_image_url"),
	...timestamps,
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	parentPostId: uuid("parent_post_id"),
	content: text().notNull(),
	...timestamps,
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const likes = pgTable("likes", {
	id: uuid().defaultRandom().primaryKey(),
	postId: uuid("post_id")
		.notNull()
		.references(() => posts.id),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	...timestamps,
});

export const follows = pgTable("follows", {
	id: uuid().defaultRandom().primaryKey(),
	followerId: uuid("follower_id")
		.notNull()
		.references(() => users.id),
	followeeId: uuid("followee_id")
		.notNull()
		.references(() => users.id),
	...timestamps,
});
