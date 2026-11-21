import { type JWTVerifyGetKey, jwtVerify } from "jose";

import type { AccessTokenVerifier } from "../../application/ports";

export const createAccessTokenVerifier = (jwks: JWTVerifyGetKey): AccessTokenVerifier => {
	return async (token) => {
		const payload = await jwtVerify(token, jwks).then(
			(result) => result.payload,
			() => null,
		);
		return payload?.sub ? { accountId: payload.sub } : null;
	};
};
