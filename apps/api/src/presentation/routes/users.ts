import { Hono } from "hono";

import type { GetUserPosts } from "../../application/get-user-posts";
import type { AccessTokenVerifier } from "../../application/ports";
import { requireAccount } from "../middleware/require-account";
import { toPostType } from "../responses/post-type";

export const usersRoutes = (deps: {
	verifyAccessToken: AccessTokenVerifier;
	getUserPosts: GetUserPosts;
}) => {
	const auth = requireAccount(deps.verifyAccessToken);
	return new Hono().get("/:userId/posts", auth, async (c) => {
		const posts = await deps.getUserPosts(c.req.param("userId"));
		return c.json(posts.map(toPostType));
	});
};
