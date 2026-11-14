import { type JWTVerifyGetKey, jwtVerify } from "jose";

import type { AccessTokenVerifier } from "../../application/ports";

/** Supabase Auth のアクセストークンを JWKS（ES256）で検証する。sub がアカウント ID */
export const createJoseAccessTokenVerifier = (jwks: JWTVerifyGetKey): AccessTokenVerifier => {
	return async (token) => {
		const payload = await jwtVerify(token, jwks).then(
			(result) => result.payload,
			() => null,
		);
		return payload?.sub ? { accountId: payload.sub } : null;
	};
};
