import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { GetComments } from "../../application/get-comments";
import type { GetPost } from "../../application/get-post";
import type { GetTimeline } from "../../application/get-timeline";
import type { AccessTokenVerifier } from "../../application/ports";
import type { SearchPosts } from "../../application/search-posts";
import { requireAccount } from "../middleware/require-account";
import { toPostType } from "../responses/post-type";

const postNotFound = () => {
	return new HTTPException(404, { message: "投稿が見つかりません。" });
};

const postIdSchema = z.object({ postId: z.guid() });

/** ID の形をしていなければ、その投稿は存在しないものとして 404 にする */
const postIdParam = zValidator("param", postIdSchema, (result) => {
	if (!result.success) {
		throw postNotFound();
	}
});

export const postsRoutes = (deps: {
	verifyAccessToken: AccessTokenVerifier;
	getTimeline: GetTimeline;
	getPost: GetPost;
	getComments: GetComments;
	searchPosts: SearchPosts;
}) => {
	const auth = requireAccount(deps.verifyAccessToken);
	// 固定のパス（/timeline など）は /:postId より先に登録する
	return new Hono()
		.get("/timeline", auth, async (c) => {
			const timeline = await deps.getTimeline(c.var.accountId);
			return c.json(timeline.map(toPostType));
		})
		.get("/search", auth, async (c) => {
			const results = await deps.searchPosts(c.req.query("q") ?? "");
			return c.json(results.map(toPostType));
		})
		.get("/:postId", auth, postIdParam, async (c) => {
			const post = await deps.getPost(c.req.valid("param").postId);
			if (!post) {
				throw postNotFound();
			}
			return c.json(toPostType(post));
		})
		.get("/:postId/comments", auth, async (c) => {
			// ID の形をしていなければ、存在しない投稿と同じくコメントは空にする
			const param = postIdSchema.safeParse(c.req.param());
			const comments = param.success ? await deps.getComments(param.data.postId) : [];
			return c.json(comments.map(toPostType));
		});
};
