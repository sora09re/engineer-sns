import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { AccessTokenVerifier } from "../../application/ports";

export type AuthEnv = { Variables: { accountId: string } };

const unauthorized = () => {
	return new HTTPException(401, { message: "ログインしていません。" });
};

/** ログイン必須。Bearer のアクセストークンを検証し、アカウント ID を c.var.accountId に置く */
export const requireAccount = (verify: AccessTokenVerifier) => {
	return createMiddleware<AuthEnv>(async (c, next) => {
		const token = c.req.header("Authorization")?.match(/^Bearer (.+)$/)?.[1];
		const verified = token ? await verify(token) : null;
		if (!verified) {
			throw unauthorized();
		}
		c.set("accountId", verified.accountId);
		await next();
	});
};
