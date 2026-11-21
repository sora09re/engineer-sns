import { Hono } from "hono";

import type { HttpAppDeps } from "../http-app";
import { requireAccount } from "../middleware/require-account";
import { toPostType, toProfileType, toUserResponse } from "../responses";

export const usersRoutes = ({ verifyAccessToken, useCases }: HttpAppDeps) => {
	const auth = requireAccount(verifyAccessToken);
	return new Hono()
		.get("/search", auth, async (c) => {
			const results = await useCases.searchUsers(c.req.query("q") ?? "");
			return c.json(results.map(toUserResponse));
		})
		.get("/:userId", auth, async (c) => {
			const profile = await useCases.getUserProfile(c.req.param("userId"));
			return c.json(toProfileType(profile));
		})
		.get("/:userId/posts", auth, async (c) => {
			const posts = await useCases.getUserPosts(c.req.param("userId"));
			return c.json(posts.map(toPostType));
		})
		.get("/:userId/follow", auth, async (c) => {
			const following = await useCases.isFollowing({
				accountId: c.var.accountId,
				userId: c.req.param("userId"),
			});
			return c.json({ following });
		})
		.put("/:userId/follow", auth, async (c) => {
			await useCases.followUser({
				accountId: c.var.accountId,
				userId: c.req.param("userId"),
			});
			return c.body(null, 204);
		})
		.delete("/:userId/follow", auth, async (c) => {
			await useCases.unfollowUser({
				accountId: c.var.accountId,
				userId: c.req.param("userId"),
			});
			return c.body(null, 204);
		})
		.get("/:userId/followers", auth, async (c) => {
			const followers = await useCases.getFollowers(c.req.param("userId"));
			return c.json(followers.map(toUserResponse));
		})
		.get("/:userId/followees", auth, async (c) => {
			const followees = await useCases.getFollowees(c.req.param("userId"));
			return c.json(followees.map(toUserResponse));
		});
};
