import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	ValidationError,
} from "../application/errors";
import type { AccessTokenVerifier } from "../application/ports";
import type { UseCases } from "../application/use-cases";
import { meRoutes } from "./routes/me";
import { postsRoutes } from "./routes/posts";
import { usersRoutes } from "./routes/users";

export type HttpAppDeps = {
	verifyAccessToken: AccessTokenVerifier;
	useCases: UseCases;
};

export const createHttpApp = (deps: HttpAppDeps) => {
	return new Hono()
		.basePath("/api")
		.route("/posts", postsRoutes(deps))
		.route("/users", usersRoutes(deps))
		.route("/me", meRoutes(deps))
		.onError((error, c) => {
			if (error instanceof HTTPException) {
				const message =
					error.status === 400 ? "リクエストの形式が正しくありません。" : error.message;
				return c.json({ message }, error.status);
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
			if (error instanceof ConflictError) {
				return c.json({ message: error.message }, 409);
			}
			console.error(error);
			return c.json({ message: "サーバーでエラーが発生しました。" }, 500);
		});
};
