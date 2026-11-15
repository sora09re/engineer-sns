import { queryOptions } from "@tanstack/react-query";

import type { ProfileType, User } from "@engineer-sns/shared";

import { api, parse, parseOrNull, queryKeys } from "@/shared/api";

/** ログイン中のアカウントのユーザー。新規ユーザー登録前なら null */
export const currentUserQuery = () => {
	return queryOptions({
		queryKey: [...queryKeys.users, "current"],
		queryFn: async (): Promise<User | null> => parse(await api.api.me.$get()),
	});
};

/** フォロワー数とフォロー数つきのユーザー。なければ null */
export const userProfileQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.users, "profile", userId],
		queryFn: async (): Promise<ProfileType | null> => {
			return parseOrNull(await api.api.users[":userId"].$get({ param: { userId } }));
		},
	});
};

/** 名前・ユーザーネーム・自己紹介のどれかにキーワードを含むユーザー。ユーザーネーム順 */
export const searchUsersQuery = (keyword: string) => {
	return queryOptions({
		queryKey: [...queryKeys.users, "search", keyword],
		queryFn: async (): Promise<User[]> => {
			return parse(await api.api.users.search.$get({ query: { q: keyword } }));
		},
	});
};

/** userId をフォローしているユーザー。フォローした順 */
export const followersQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "followers", userId],
		queryFn: async (): Promise<User[]> => {
			return parse(await api.api.users[":userId"].followers.$get({ param: { userId } }));
		},
	});
};

/** userId がフォローしているユーザー。フォローした順 */
export const followeesQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "followees", userId],
		queryFn: async (): Promise<User[]> => {
			return parse(await api.api.users[":userId"].followees.$get({ param: { userId } }));
		},
	});
};
