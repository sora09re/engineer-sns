/**
 * 組み立て（composition root）。依存の向きは presentation → application → domain で、
 * infrastructure は application の ports を実装する。ここだけがすべての層を知っている。
 */
import type { JWTVerifyGetKey } from "jose";

import { createComment } from "./application/create-comment";
import { createPost } from "./application/create-post";
import { deletePost } from "./application/delete-post";
import { getComments } from "./application/get-comments";
import { getPost } from "./application/get-post";
import { getTimeline } from "./application/get-timeline";
import { getUserPosts } from "./application/get-user-posts";
import { likePost } from "./application/like-post";
import { searchPosts } from "./application/search-posts";
import { unlikePost } from "./application/unlike-post";
import { createAccessTokenVerifier } from "./infrastructure/auth/access-token-verifier";
import type { Db } from "./infrastructure/db/client";
import { createFollowRepository } from "./infrastructure/repositories/follow-repository";
import { createLikeRepository } from "./infrastructure/repositories/like-repository";
import { createPostQuery } from "./infrastructure/repositories/post-query";
import { createPostRepository } from "./infrastructure/repositories/post-repository";
import { createUserRepository } from "./infrastructure/repositories/user-repository";
import { createHttpApp } from "./presentation/http-app";

export type AppDeps = { db: Db; jwks: JWTVerifyGetKey };

export const createApp = ({ db, jwks }: AppDeps) => {
	const follows = createFollowRepository(db);
	const posts = createPostQuery(db);
	const postRepository = createPostRepository(db);
	const users = createUserRepository(db);
	const likes = createLikeRepository(db);

	return createHttpApp({
		verifyAccessToken: createAccessTokenVerifier(jwks),
		getTimeline: getTimeline({ follows, posts }),
		getPost: getPost({ posts }),
		getComments: getComments({ posts }),
		getUserPosts: getUserPosts({ posts }),
		searchPosts: searchPosts({ posts }),
		createPost: createPost({ users, postRepository, posts }),
		createComment: createComment({ users, postRepository, posts }),
		deletePost: deletePost({ postRepository }),
		likePost: likePost({ users, likes, postRepository }),
		unlikePost: unlikePost({ likes, postRepository }),
	});
};

export type AppType = ReturnType<typeof createApp>;
