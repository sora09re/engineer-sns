import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { HttpAppDeps } from "../deps";
import { requireAccount } from "../middleware/require-account";
import { toPostType, toUserResponse } from "../responses/post-type";
import { toProfileType } from "../responses/profile-type";

const userIdSchema = z.object({ userId: z.guid() });

/** ID の形をしていなければ、そのユーザーは存在しないものとして 404 にする */
const userIdParam = zValidator("param", userIdSchema, (result) => {
	if (!result.success) {
		throw new HTTPException(404, { message: "ユーザーが見つかりません。" });
	}
});

export const usersRoutes = ({ verifyAccessToken, useCases }: HttpAppDeps) => {
	const auth = requireAccount(verifyAccessToken);
	// 固定のパス（/search）は /:userId より先に登録する
	return new Hono()
		.get("/search", auth, async (c) => {
			const results = await useCases.searchUsers(c.req.query("q") ?? "");
			return c.json(results.map(toUserResponse));
		})
		.get("/:userId", auth, userIdParam, async (c) => {
			const profile = await useCases.getUserProfile(c.req.valid("param").userId);
			if (!profile) {
				throw new HTTPException(404, { message: "ユーザーが見つかりません。" });
			}
			return c.json(toProfileType(profile));
		})
		.get("/:userId/posts", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const posts = param.success ? await useCases.getUserPosts(param.data.userId) : [];
			return c.json(posts.map(toPostType));
		})
		.get("/:userId/follow", auth, userIdParam, async (c) => {
			const following = await useCases.isFollowing({
				accountId: c.var.accountId,
				userId: c.req.valid("param").userId,
			});
			return c.json({ following });
		})
		.put("/:userId/follow", auth, userIdParam, async (c) => {
			await useCases.followUser({
				accountId: c.var.accountId,
				userId: c.req.valid("param").userId,
			});
			return c.body(null, 204);
		})
		.delete("/:userId/follow", auth, userIdParam, async (c) => {
			await useCases.unfollowUser({
				accountId: c.var.accountId,
				userId: c.req.valid("param").userId,
			});
			return c.body(null, 204);
		})
		.get("/:userId/followers", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const followers = param.success ? await useCases.getFollowers(param.data.userId) : [];
			return c.json(followers.map(toUserResponse));
		})
		.get("/:userId/followees", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const followees = param.success ? await useCases.getFollowees(param.data.userId) : [];
			return c.json(followees.map(toUserResponse));
		});
};
