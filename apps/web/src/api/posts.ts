import type { PostType } from "@engineer-sns/shared";

import { supabase, throwIfError } from "./client";
import { api, parse } from "./http";
import { requireAccountId } from "./session";

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
	const accountId = await requireAccountId();
	throwIfError(await supabase.from("posts").insert({ content, user_id: accountId }));
};

export const createComment = async ({ content, postId }: { content: string; postId: string }) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("posts").insert({ content, parent_post_id: postId, user_id: accountId }),
	);
};

export const deletePost = async (postId: string) => {
	throwIfError(await supabase.from("posts").delete().eq("id", postId));
};
