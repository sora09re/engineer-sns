import type { QueryClient } from "@tanstack/react-query";

const posts = ["posts"] as const;
const users = ["users"] as const;
const follows = ["follows"] as const;

export const queryKeys = {
	posts: {
		all: posts,
		timeline: () => [...posts, "timeline"] as const,
		detail: (postId: string) => [...posts, "detail", postId] as const,
		comments: (postId: string) => [...posts, "comments", postId] as const,
		user: (userId: string) => [...posts, "user", userId] as const,
		search: (keyword: string) => [...posts, "search", keyword] as const,
	},
	users: {
		all: users,
		current: () => [...users, "current"] as const,
		profile: (userId: string) => [...users, "profile", userId] as const,
		search: (keyword: string) => [...users, "search", keyword] as const,
	},
	follows: {
		all: follows,
		followers: (userId: string) => [...follows, "followers", userId] as const,
		followees: (userId: string) => [...follows, "followees", userId] as const,
	},
};

const sameKey = (a: readonly unknown[], b: readonly unknown[]) => {
	return a.length === b.length && a.every((part, index) => part === b[index]);
};

export const afterPostsChanged = (queryClient: QueryClient) => {
	return queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
};

export const afterPostDeleted = async (queryClient: QueryClient, postId: string) => {
	const deleted = [queryKeys.posts.detail(postId), queryKeys.posts.comments(postId)];
	await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all, refetchType: "none" });
	await queryClient.refetchQueries({
		queryKey: queryKeys.posts.all,
		type: "active",
		predicate: (query) => !deleted.some((key) => sameKey(key, query.queryKey)),
	});
};

export const afterFollowChanged = (queryClient: QueryClient) => {
	return Promise.all([
		queryClient.invalidateQueries({ queryKey: queryKeys.follows.all }),
		queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
		queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
	]);
};

export const afterLoginUserChanged = (queryClient: QueryClient) => {
	return Promise.all([
		queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
		queryClient.invalidateQueries({ queryKey: queryKeys.posts.all }),
		queryClient.invalidateQueries({ queryKey: queryKeys.follows.all }),
	]);
};

export const afterUserRegistered = (queryClient: QueryClient) => {
	return queryClient.invalidateQueries({ queryKey: queryKeys.users.all, refetchType: "all" });
};
