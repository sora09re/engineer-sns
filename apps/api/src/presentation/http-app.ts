import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { GetTimeline } from "../application/get-timeline";
import type { AccessTokenVerifier } from "../application/ports";
import { postsRoutes } from "./routes/posts";

export type HttpAppDeps = {
	verifyAccessToken: AccessTokenVerifier;
	getTimeline: GetTimeline;
};

/** HTTP の入口。失敗は { message } とステータスコードで返す */
export const createHttpApp = (deps: HttpAppDeps) => {
	return new Hono()
		.basePath("/api")
		.route("/posts", postsRoutes(deps))
		.onError((error, c) => {
			if (error instanceof HTTPException) {
				return c.json({ message: error.message }, error.status);
			}
			console.error(error);
			return c.json({ message: "サーバーでエラーが発生しました。" }, 500);
		});
};
