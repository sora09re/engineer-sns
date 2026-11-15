import { api, ensureOk } from "./http";

/** フォローする。すでにフォローしていても成功する */
export const follow = async (userId: string) => {
	await ensureOk(await api.api.users[":userId"].follow.$put({ param: { userId } }));
};

/** フォローを外す。フォローしていなくても成功する */
export const unfollow = async (userId: string) => {
	await ensureOk(await api.api.users[":userId"].follow.$delete({ param: { userId } }));
};
