import { createRemoteJWKSet } from "jose";

import { createApp } from "./app";
import { connect } from "./infrastructure/db/client";
import { readEnv } from "./env";

export type { AppType } from "./app";

/** 環境変数から本番用の app を組み立てる（Vercel Functions とローカルのサーバーで使う） */
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
