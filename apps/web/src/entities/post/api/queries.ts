import { queryOptions } from "@tanstack/react-query";

import type { PostType } from "@engineer-sns/shared";

import { api, defineDetailQuery, parse, queryKeys } from "@/shared/api";

export const timelinePostsQuery = () => {
	return queryOptions({
		queryKey: queryKeys.posts.timeline(),
		queryFn: async (): Promise<PostType[]> => parse(await api.api.posts.timeline.$get()),
	});
};

export const postDetail = defineDetailQuery({
	queryKey: queryKeys.posts.detail,
	request: (postId) => api.api.posts[":postId"].$get({ param: { postId } }),
});

export const commentsQuery = (postId: string) => {
	return queryOptions({
		queryKey: queryKeys.posts.comments(postId),
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.posts[":postId"].comments.$get({ param: { postId } }));
		},
	});
};

export const userPostsQuery = (userId: string) => {
	return queryOptions({
		queryKey: queryKeys.posts.user(userId),
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.users[":userId"].posts.$get({ param: { userId } }));
		},
	});
};

export const searchPostsQuery = (keyword: string) => {
	return queryOptions({
		queryKey: queryKeys.posts.search(keyword),
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.posts.search.$get({ query: { q: keyword } }));
		},
	});
};
