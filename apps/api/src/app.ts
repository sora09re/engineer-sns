/**
 * 組み立て（composition root）。依存の向きは presentation → application → domain で、
 * infrastructure は application の ports を実装する。ここだけがすべての層を知っている。
 * どの adapter を使うかをここで決め、ユースケースへの配線は createUseCases に任せる
 */
import type { JWTVerifyGetKey } from "jose";

import { createUseCases } from "./application/use-cases";
import { createAccessTokenVerifier } from "./infrastructure/auth/access-token-verifier";
import type { Db } from "./infrastructure/db/client";
import { createFollowRepository } from "./infrastructure/repositories/follow-repository";
import { createLikeRepository } from "./infrastructure/repositories/like-repository";
import { createPostRepository } from "./infrastructure/repositories/post-repository";
import { createUserRepository } from "./infrastructure/repositories/user-repository";
import {
	createProfileImageStorage,
	type StorageConfig,
} from "./infrastructure/storage/profile-image-storage";
import { createHttpApp } from "./presentation/http-app";

export type AppDeps = { db: Db; jwks: JWTVerifyGetKey; storage: StorageConfig };

export const createApp = ({ db, jwks, storage }: AppDeps) => {
	return createHttpApp({
		verifyAccessToken: createAccessTokenVerifier(jwks),
		useCases: createUseCases({
			follows: createFollowRepository(db),
			likes: createLikeRepository(db),
			posts: createPostRepository(db),
			users: createUserRepository(db),
			storage: createProfileImageStorage(storage),
		}),
	});
};

export type AppType = ReturnType<typeof createApp>;
