import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { CreateComment } from "../application/create-comment";
import type { CreatePost } from "../application/create-post";
import { ForbiddenError, NotFoundError, ValidationError } from "../application/errors";
import type { DeletePost } from "../application/delete-post";
import type { GetComments } from "../application/get-comments";
import type { GetPost } from "../application/get-post";
import type { GetTimeline } from "../application/get-timeline";
import type { GetUserPosts } from "../application/get-user-posts";
import type { AccessTokenVerifier } from "../application/ports";
import type { SearchPosts } from "../application/search-posts";
import { postsRoutes } from "./routes/posts";
import { usersRoutes } from "./routes/users";

export type HttpAppDeps = {
	verifyAccessToken: AccessTokenVerifier;
	getTimeline: GetTimeline;
	getPost: GetPost;
	getComments: GetComments;
	getUserPosts: GetUserPosts;
	searchPosts: SearchPosts;
	createPost: CreatePost;
	createComment: CreateComment;
	deletePost: DeletePost;
};

/** HTTP の入口。失敗は { message } とステータスコードで返す */
export const createHttpApp = (deps: HttpAppDeps) => {
	return new Hono()
		.basePath("/api")
		.route("/posts", postsRoutes(deps))
		.route("/users", usersRoutes(deps))
		.onError((error, c) => {
			if (error instanceof HTTPException) {
				return c.json({ message: error.message }, error.status);
			}
			if (error instanceof ValidationError) {
				return c.json({ message: error.message }, 422);
			}
			if (error instanceof NotFoundError) {
				return c.json({ message: error.message }, 404);
			}
			if (error instanceof ForbiddenError) {
				return c.json({ message: error.message }, 403);
			}
			console.error(error);
			return c.json({ message: "サーバーでエラーが発生しました。" }, 500);
		});
};
