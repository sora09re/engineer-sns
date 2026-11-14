import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";

/**
 * テスト用の署名鍵。Supabase Auth と同じ ES256 で署名し、API にはその公開鍵の JWKS を渡す。
 * 差し替えるのは鍵の取得元だけで、検証のコードは本番と同じものが動く。
 */
export const createTestKeys = async () => {
	const kid = "test-key";
	const { privateKey, publicKey } = await generateKeyPair("ES256");
	const jwk = { ...(await exportJWK(publicKey)), kid, alg: "ES256" };

	const sign = (claims: { sub: string; expiresIn?: string }) => {
		return new SignJWT({ role: "authenticated" })
			.setProtectedHeader({ alg: "ES256", kid })
			.setSubject(claims.sub)
			.setIssuedAt()
			.setExpirationTime(claims.expiresIn ?? "1h")
			.sign(privateKey);
	};

	return { jwks: createLocalJWKSet({ keys: [jwk] }), sign };
};
