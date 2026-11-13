import { queryOptions } from "@tanstack/react-query";

import { getFollowees, getFollowers, isFollowing } from "./follows";
import { getComments, getPost, getTimelinePosts, getUserPosts, searchPosts } from "./posts";
import { getCurrentUser, getUserProfile, searchUsers } from "./users";

/**
 * クエリキーの階層。更新後は先頭の要素（"users" / "posts" / "follows"）単位で無効化する。
 */
export const queryKeys = {
	users: ["users"] as const,
	posts: ["posts"] as const,
	follows: ["follows"] as const,
};

export const currentUserQuery = () => {
	return queryOptions({ queryKey: [...queryKeys.users, "current"], queryFn: getCurrentUser });
};

export const userProfileQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.users, "profile", userId],
		queryFn: () => getUserProfile(userId),
	});
};

export const searchUsersQuery = (keyword: string) => {
	return queryOptions({
		queryKey: [...queryKeys.users, "search", keyword],
		queryFn: () => searchUsers(keyword),
	});
};

export const timelinePostsQuery = () => {
	return queryOptions({ queryKey: [...queryKeys.posts, "timeline"], queryFn: getTimelinePosts });
};

export const postQuery = (postId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "detail", postId],
		queryFn: () => getPost(postId),
	});
};

export const commentsQuery = (postId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "comments", postId],
		queryFn: () => getComments(postId),
	});
};

export const userPostsQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "user", userId],
		queryFn: () => getUserPosts(userId),
	});
};

export const searchPostsQuery = (keyword: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "search", keyword],
		queryFn: () => searchPosts(keyword),
	});
};

export const isFollowingQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "isFollowing", userId],
		queryFn: () => isFollowing(userId),
	});
};

export const followersQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "followers", userId],
		queryFn: () => getFollowers(userId),
	});
};

export const followeesQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "followees", userId],
		queryFn: () => getFollowees(userId),
	});
};
