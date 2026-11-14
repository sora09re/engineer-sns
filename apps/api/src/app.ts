import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { JWTVerifyGetKey } from "jose";

import type { Db } from "./db/client";
import { postsRoutes } from "./routes/posts";

export type AppDeps = { db: Db; jwks: JWTVerifyGetKey };

export const createApp = (deps: AppDeps) => {
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

export type AppType = ReturnType<typeof createApp>;
