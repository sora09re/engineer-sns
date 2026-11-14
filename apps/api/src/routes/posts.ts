import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { Hono } from "hono";

import type { AppDeps } from "../app";
import { requireAccount } from "../auth";
import { follows, posts } from "../db/schema";
import { findPosts } from "../posts/queries";

export const postsRoutes = ({ db, jwks }: AppDeps) => {
	return new Hono().get("/timeline", requireAccount(jwks), async (c) => {
		const { accountId } = c.var;
		const followees = db
			.select({ id: follows.followeeId })
			.from(follows)
			.where(eq(follows.followerId, accountId));
		// タイムライン: 自分とフォローしているユーザーの、コメントでない投稿
		const timeline = await findPosts(
			db,
			and(
				isNull(posts.parentPostId),
				or(eq(posts.userId, accountId), inArray(posts.userId, followees)),
			),
		);
		return c.json(timeline);
	});
};
