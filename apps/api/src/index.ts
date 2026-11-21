import { createRemoteJWKSet } from "jose";

import { createApp } from "./app";
import { connect } from "./infrastructure/db/client";
import { readEnv } from "./env";

export type { AppType } from "./app";

export const createAppFromEnv = () => {
	const env = readEnv();
	const { db } = connect(env.DATABASE_URL);
	const jwks = createRemoteJWKSet(new URL("/auth/v1/.well-known/jwks.json", env.SUPABASE_URL));
	return createApp({
		db,
		jwks,
		storage: { url: env.SUPABASE_URL, secretKey: env.SUPABASE_SECRET_KEY },
	});
};
