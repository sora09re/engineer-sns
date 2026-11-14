import type { User } from "@engineer-sns/shared";

import { api, ensureOk, parse } from "./http";

/** ログイン中のユーザーが userId をフォローしているか */
export const isFollowing = async (userId: string): Promise<boolean> => {
	const { following } = await parse(
		await api.api.users[":userId"].follow.$get({ param: { userId } }),
	);
	return following;
};

/** フォローする。すでにフォローしていても成功する */
export const follow = async (userId: string) => {
	await ensureOk(await api.api.users[":userId"].follow.$put({ param: { userId } }));
};

/** フォローを外す。フォローしていなくても成功する */
export const unfollow = async (userId: string) => {
	await ensureOk(await api.api.users[":userId"].follow.$delete({ param: { userId } }));
};

/** userId をフォローしているユーザー。フォローした順 */
export const getFollowers = async (userId: string): Promise<User[]> => {
	return parse(await api.api.users[":userId"].followers.$get({ param: { userId } }));
};

/** userId がフォローしているユーザー。フォローした順 */
export const getFollowees = async (userId: string): Promise<User[]> => {
	return parse(await api.api.users[":userId"].followees.$get({ param: { userId } }));
};
