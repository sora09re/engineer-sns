import { queryOptions } from "@tanstack/react-query";

import type { LoginUser, UserView } from "@engineer-sns/shared";

import { api, defineDetailQuery, parse, queryKeys } from "@/shared/api";

export const currentUserQuery = () => {
	return queryOptions({
		queryKey: queryKeys.users.current(),
		queryFn: async (): Promise<LoginUser | null> => parse(await api.api.me.$get()),
	});
};

export const userProfileDetail = defineDetailQuery({
	queryKey: queryKeys.users.profile,
	request: (userId) => api.api.users[":userId"].$get({ param: { userId } }),
});

export const searchUsersQuery = (keyword: string) => {
	return queryOptions({
		queryKey: queryKeys.users.search(keyword),
		queryFn: async (): Promise<UserView[]> => {
			return parse(await api.api.users.search.$get({ query: { q: keyword } }));
		},
	});
};

export const followersQuery = (userId: string) => {
	return queryOptions({
		queryKey: queryKeys.follows.followers(userId),
		queryFn: async (): Promise<UserView[]> => {
			return parse(await api.api.users[":userId"].followers.$get({ param: { userId } }));
		},
	});
};

export const followeesQuery = (userId: string) => {
	return queryOptions({
		queryKey: queryKeys.follows.followees(userId),
		queryFn: async (): Promise<UserView[]> => {
			return parse(await api.api.users[":userId"].followees.$get({ param: { userId } }));
		},
	});
};
