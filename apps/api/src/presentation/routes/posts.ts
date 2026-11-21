import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { HttpAppDeps } from "../http-app";
import { requireAccount } from "../middleware/require-account";
import { toPostType } from "../responses";

const postBody = zValidator("json", z.object({ content: z.string() }), (result) => {
	if (!result.success) {
		throw new HTTPException(422, { message: "本文を入力してください。" });
	}
});

export const postsRoutes = ({ verifyAccessToken, useCases }: HttpAppDeps) => {
	const auth = requireAccount(verifyAccessToken);
	return new Hono()
		.get("/timeline", auth, async (c) => {
			const timeline = await useCases.getTimeline(c.var.accountId);
			return c.json(timeline.map(toPostType));
		})
		.get("/search", auth, async (c) => {
			const results = await useCases.searchPosts(c.req.query("q") ?? "");
			return c.json(results.map(toPostType));
		})
		.get("/:postId", auth, async (c) => {
			const post = await useCases.getPost(c.req.param("postId"));
			return c.json(toPostType(post));
		})
		.get("/:postId/comments", auth, async (c) => {
			const comments = await useCases.getComments(c.req.param("postId"));
			return c.json(comments.map(toPostType));
		})
		.post("/", auth, postBody, async (c) => {
			const { content } = c.req.valid("json");
			const post = await useCases.createPost({ accountId: c.var.accountId, content });
			return c.json(toPostType(post), 201);
		})
		.post("/:postId/comments", auth, postBody, async (c) => {
			const { content } = c.req.valid("json");
			const comment = await useCases.createComment({
				accountId: c.var.accountId,
				postId: c.req.param("postId"),
				content,
			});
			return c.json(toPostType(comment), 201);
		})
		.delete("/:postId", auth, async (c) => {
			await useCases.deletePost({
				accountId: c.var.accountId,
				postId: c.req.param("postId"),
			});
			return c.body(null, 204);
		})
		.put("/:postId/like", auth, async (c) => {
			await useCases.likePost({ accountId: c.var.accountId, postId: c.req.param("postId") });
			return c.body(null, 204);
		})
		.delete("/:postId/like", auth, async (c) => {
			await useCases.unlikePost({
				accountId: c.var.accountId,
				postId: c.req.param("postId"),
			});
			return c.body(null, 204);
		});
};
