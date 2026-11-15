import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { HttpAppDeps } from "../deps";
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

/** 本文の形が不正なら（content がない、文字列でない）、空の本文と同じく 422 にする */
const postBody = zValidator("json", z.object({ content: z.string() }), (result) => {
	if (!result.success) {
		throw new HTTPException(422, { message: "本文を入力してください。" });
	}
});

export const postsRoutes = ({ verifyAccessToken, useCases }: HttpAppDeps) => {
	const auth = requireAccount(verifyAccessToken);
	// 固定のパス（/timeline など）は /:postId より先に登録する
	return new Hono()
		.get("/timeline", auth, async (c) => {
			const timeline = await useCases.getTimeline(c.var.accountId);
			return c.json(timeline.map(toPostType));
		})
		.get("/search", auth, async (c) => {
			const results = await useCases.searchPosts(c.req.query("q") ?? "");
			return c.json(results.map(toPostType));
		})
		.get("/:postId", auth, postIdParam, async (c) => {
			const post = await useCases.getPost(c.req.valid("param").postId);
			if (!post) {
				throw postNotFound();
			}
			return c.json(toPostType(post));
		})
		.get("/:postId/comments", auth, async (c) => {
			// ID の形をしていなければ、存在しない投稿と同じくコメントは空にする
			const param = postIdSchema.safeParse(c.req.param());
			const comments = param.success ? await useCases.getComments(param.data.postId) : [];
			return c.json(comments.map(toPostType));
		})
		.post("/", auth, postBody, async (c) => {
			const { content } = c.req.valid("json");
			const post = await useCases.createPost({ accountId: c.var.accountId, content });
			return c.json(toPostType(post), 201);
		})
		.post("/:postId/comments", auth, postIdParam, postBody, async (c) => {
			const { content } = c.req.valid("json");
			const comment = await useCases.createComment({
				accountId: c.var.accountId,
				postId: c.req.valid("param").postId,
				content,
			});
			return c.json(toPostType(comment), 201);
		})
		.delete("/:postId", auth, postIdParam, async (c) => {
			await useCases.deletePost({
				accountId: c.var.accountId,
				postId: c.req.valid("param").postId,
			});
			return c.body(null, 204);
		})
		.put("/:postId/like", auth, postIdParam, async (c) => {
			await useCases.likePost({ accountId: c.var.accountId, postId: c.req.valid("param").postId });
			return c.body(null, 204);
		})
		.delete("/:postId/like", auth, postIdParam, async (c) => {
			await useCases.unlikePost({
				accountId: c.var.accountId,
				postId: c.req.valid("param").postId,
			});
			return c.body(null, 204);
		});
};
