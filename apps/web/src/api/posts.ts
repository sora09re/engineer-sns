import { api, ensureOk } from "./http";

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
