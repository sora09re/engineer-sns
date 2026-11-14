import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { CreateComment } from "../application/create-comment";
import type { CreatePost } from "../application/create-post";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	ValidationError,
} from "../application/errors";
import type { DeletePost } from "../application/delete-post";
import type { FollowUser } from "../application/follow-user";
import type { GetComments } from "../application/get-comments";
import type { GetCurrentUser } from "../application/get-current-user";
import type { GetFollowees, GetFollowers } from "../application/get-follows";
import type { GetPost } from "../application/get-post";
import type { GetTimeline } from "../application/get-timeline";
import type { LikePost } from "../application/like-post";
import type { GetUserPosts } from "../application/get-user-posts";
import type { GetUserProfile } from "../application/get-user-profile";
import type { IssueProfileImageUpload } from "../application/issue-profile-image-upload";
import type { IsFollowing } from "../application/is-following";
import type { AccessTokenVerifier } from "../application/ports";
import type { RegisterUser } from "../application/register-user";
import type { SearchPosts } from "../application/search-posts";
import type { SearchUsers } from "../application/search-users";
import type { UnfollowUser } from "../application/unfollow-user";
import type { UpdateCurrentUser } from "../application/update-current-user";
import type { UnlikePost } from "../application/unlike-post";
import { meRoutes } from "./routes/me";
import { postsRoutes } from "./routes/posts";
import { usersRoutes } from "./routes/users";

export type HttpAppDeps = {
	verifyAccessToken: AccessTokenVerifier;
	getTimeline: GetTimeline;
	getPost: GetPost;
	getComments: GetComments;
	getUserPosts: GetUserPosts;
	searchPosts: SearchPosts;
	createPost: CreatePost;
	createComment: CreateComment;
	deletePost: DeletePost;
	likePost: LikePost;
	unlikePost: UnlikePost;
	isFollowing: IsFollowing;
	followUser: FollowUser;
	unfollowUser: UnfollowUser;
	getFollowers: GetFollowers;
	getFollowees: GetFollowees;
	getCurrentUser: GetCurrentUser;
	getUserProfile: GetUserProfile;
	searchUsers: SearchUsers;
	registerUser: RegisterUser;
	updateCurrentUser: UpdateCurrentUser;
	issueProfileImageUpload: IssueProfileImageUpload;
};

/** HTTP の入口。失敗は { message } とステータスコードで返す */
export const createHttpApp = (deps: HttpAppDeps) => {
	return new Hono()
		.basePath("/api")
		.route("/posts", postsRoutes(deps))
		.route("/users", usersRoutes(deps))
		.route("/me", meRoutes(deps))
		.onError((error, c) => {
			if (error instanceof HTTPException) {
				// 400 は Hono が投げる（本文が JSON として読めないなど）。メッセージが英語なので置き換える
				const message =
					error.status === 400 ? "リクエストの形式が正しくありません。" : error.message;
				return c.json({ message }, error.status);
			}
			if (error instanceof ValidationError) {
				return c.json({ message: error.message }, 422);
			}
			if (error instanceof NotFoundError) {
				return c.json({ message: error.message }, 404);
			}
			if (error instanceof ForbiddenError) {
				return c.json({ message: error.message }, 403);
			}
			if (error instanceof ConflictError) {
				return c.json({ message: error.message }, 409);
			}
			console.error(error);
			return c.json({ message: "サーバーでエラーが発生しました。" }, 500);
		});
};
