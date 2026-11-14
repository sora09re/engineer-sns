import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { type JWTVerifyGetKey, jwtVerify } from "jose";

export type AuthEnv = { Variables: { accountId: string } };

const unauthorized = () => {
	return new HTTPException(401, { message: "ログインしていません。" });
};

/**
 * ログイン必須。Supabase Auth のアクセストークン（Bearer）を JWKS で検証し、
 * アカウント ID（sub）を c.var.accountId に置く。
 */
export const requireAccount = (jwks: JWTVerifyGetKey) => {
	return createMiddleware<AuthEnv>(async (c, next) => {
		const token = c.req.header("Authorization")?.match(/^Bearer (.+)$/)?.[1];
		if (!token) {
			throw unauthorized();
		}
		const payload = await jwtVerify(token, jwks).then(
			(result) => result.payload,
			() => null,
		);
		if (!payload?.sub) {
			throw unauthorized();
		}
		c.set("accountId", payload.sub);
		await next();
	});
};
