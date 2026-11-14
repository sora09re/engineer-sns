import { api, ensureOk } from "./http";

/** いいねする。すでにいいねしていても成功する */
export const likePost = async (postId: string) => {
	await ensureOk(await api.api.posts[":postId"].like.$put({ param: { postId } }));
};

/** いいねを外す。いいねしていなくても成功する */
export const unlikePost = async (postId: string) => {
	await ensureOk(await api.api.posts[":postId"].like.$delete({ param: { postId } }));
};
