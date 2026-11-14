import type { PostType } from "@engineer-sns/shared";

import { api, ensureOk, parse } from "./http";

/** タイムライン: 自分とフォローしているユーザーの、コメントでない投稿 */
export const getTimelinePosts = async (): Promise<PostType[]> => {
	return parse(await api.api.posts.timeline.$get());
};

/** 投稿（コメントを含む）を 1 件。なければ null */
export const getPost = async (postId: string): Promise<PostType | null> => {
	const response = await api.api.posts[":postId"].$get({ param: { postId } });
	if (response.status === 404) {
		return null;
	}
	return parse(response);
};

export const getComments = async (postId: string): Promise<PostType[]> => {
	return parse(await api.api.posts[":postId"].comments.$get({ param: { postId } }));
};

/** ユーザーが書いた投稿（コメントを含む） */
export const getUserPosts = async (userId: string): Promise<PostType[]> => {
	return parse(await api.api.users[":userId"].posts.$get({ param: { userId } }));
};

export const searchPosts = async (keyword: string): Promise<PostType[]> => {
	return parse(await api.api.posts.search.$get({ query: { q: keyword } }));
};

export const createPost = async (content: string) => {
	await ensureOk(await api.api.posts.$post({ json: { content } }));
};

export const createComment = async ({ content, postId }: { content: string; postId: string }) => {
	await ensureOk(
		await api.api.posts[":postId"].comments.$post({ param: { postId }, json: { content } }),
	);
};

export const deletePost = async (postId: string) => {
	await ensureOk(await api.api.posts[":postId"].$delete({ param: { postId } }));
};
