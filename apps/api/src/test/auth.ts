import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";

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
