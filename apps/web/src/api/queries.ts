import { queryOptions } from "@tanstack/react-query";

import type { PostType, ProfileType, User } from "@engineer-sns/shared";

import { api, parse, parseOrNull, queryKeys } from "@/shared/api";

/** 読み取りのクエリ。API を呼ぶのはここの queryFn だけ（更新は mutations.ts の mutationFn） */

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

/** タイムライン: 自分とフォローしているユーザーの、コメントでない投稿 */
export const timelinePostsQuery = () => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "timeline"],
		queryFn: async (): Promise<PostType[]> => parse(await api.api.posts.timeline.$get()),
	});
};

/** 投稿（コメントを含む）を 1 件。なければ null */
export const postQuery = (postId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "detail", postId],
		queryFn: async (): Promise<PostType | null> => {
			return parseOrNull(await api.api.posts[":postId"].$get({ param: { postId } }));
		},
	});
};

export const commentsQuery = (postId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "comments", postId],
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.posts[":postId"].comments.$get({ param: { postId } }));
		},
	});
};

/** ユーザーが書いた投稿（コメントを含む） */
export const userPostsQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "user", userId],
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.users[":userId"].posts.$get({ param: { userId } }));
		},
	});
};

export const searchPostsQuery = (keyword: string) => {
	return queryOptions({
		queryKey: [...queryKeys.posts, "search", keyword],
		queryFn: async (): Promise<PostType[]> => {
			return parse(await api.api.posts.search.$get({ query: { q: keyword } }));
		},
	});
};

/** ログイン中のユーザーが userId をフォローしているか */
export const isFollowingQuery = (userId: string) => {
	return queryOptions({
		queryKey: [...queryKeys.follows, "isFollowing", userId],
		queryFn: async (): Promise<boolean> => {
			const { following } = await parse(
				await api.api.users[":userId"].follow.$get({ param: { userId } }),
			);
			return following;
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
