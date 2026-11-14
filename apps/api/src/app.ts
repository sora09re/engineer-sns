/**
 * 組み立て（composition root）。依存の向きは presentation → application → domain で、
 * infrastructure は application の ports を実装する。ここだけがすべての層を知っている。
 */
import type { JWTVerifyGetKey } from "jose";

import { getComments } from "./application/get-comments";
import { getPost } from "./application/get-post";
import { getTimeline } from "./application/get-timeline";
import { getUserPosts } from "./application/get-user-posts";
import { searchPosts } from "./application/search-posts";
import { createJoseAccessTokenVerifier } from "./infrastructure/auth/jose-access-token-verifier";
import type { Db } from "./infrastructure/db/client";
import { createDrizzleFollowRepository } from "./infrastructure/repositories/drizzle-follow-repository";
import { createDrizzlePostQuery } from "./infrastructure/repositories/drizzle-post-query";
import { createHttpApp } from "./presentation/http-app";

export type AppDeps = { db: Db; jwks: JWTVerifyGetKey };

export const createApp = ({ db, jwks }: AppDeps) => {
	const follows = createDrizzleFollowRepository(db);
	const posts = createDrizzlePostQuery(db);

	return createHttpApp({
		verifyAccessToken: createJoseAccessTokenVerifier(jwks),
		getTimeline: getTimeline({ follows, posts }),
		getPost: getPost({ posts }),
		getComments: getComments({ posts }),
		getUserPosts: getUserPosts({ posts }),
		searchPosts: searchPosts({ posts }),
	});
};

export type AppType = ReturnType<typeof createApp>;
