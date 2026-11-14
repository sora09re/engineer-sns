import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { FollowUser } from "../../application/follow-user";
import type { GetFollowees, GetFollowers } from "../../application/get-follows";
import type { GetUserPosts } from "../../application/get-user-posts";
import type { GetUserProfile } from "../../application/get-user-profile";
import type { IsFollowing } from "../../application/is-following";
import type { AccessTokenVerifier } from "../../application/ports";
import type { SearchUsers } from "../../application/search-users";
import type { UnfollowUser } from "../../application/unfollow-user";
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

export const usersRoutes = (deps: {
	verifyAccessToken: AccessTokenVerifier;
	getUserPosts: GetUserPosts;
	isFollowing: IsFollowing;
	followUser: FollowUser;
	unfollowUser: UnfollowUser;
	getFollowers: GetFollowers;
	getFollowees: GetFollowees;
	getUserProfile: GetUserProfile;
	searchUsers: SearchUsers;
}) => {
	const auth = requireAccount(deps.verifyAccessToken);
	// 固定のパス（/search）は /:userId より先に登録する
	return new Hono()
		.get("/search", auth, async (c) => {
			const results = await deps.searchUsers(c.req.query("q") ?? "");
			return c.json(results.map(toUserResponse));
		})
		.get("/:userId", auth, userIdParam, async (c) => {
			const profile = await deps.getUserProfile(c.req.valid("param").userId);
			if (!profile) {
				throw new HTTPException(404, { message: "ユーザーが見つかりません。" });
			}
			return c.json(toProfileType(profile));
		})
		.get("/:userId/posts", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const posts = param.success ? await deps.getUserPosts(param.data.userId) : [];
			return c.json(posts.map(toPostType));
		})
		.get("/:userId/follow", auth, userIdParam, async (c) => {
			const following = await deps.isFollowing({
				accountId: c.var.accountId,
				userId: c.req.valid("param").userId,
			});
			return c.json({ following });
		})
		.put("/:userId/follow", auth, userIdParam, async (c) => {
			await deps.followUser({ accountId: c.var.accountId, userId: c.req.valid("param").userId });
			return c.body(null, 204);
		})
		.delete("/:userId/follow", auth, userIdParam, async (c) => {
			await deps.unfollowUser({ accountId: c.var.accountId, userId: c.req.valid("param").userId });
			return c.body(null, 204);
		})
		.get("/:userId/followers", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const followers = param.success ? await deps.getFollowers(param.data.userId) : [];
			return c.json(followers.map(toUserResponse));
		})
		.get("/:userId/followees", auth, async (c) => {
			// ID の形をしていなければ、存在しないユーザーと同じく空にする
			const param = userIdSchema.safeParse(c.req.param());
			const followees = param.success ? await deps.getFollowees(param.data.userId) : [];
			return c.json(followees.map(toUserResponse));
		});
};
