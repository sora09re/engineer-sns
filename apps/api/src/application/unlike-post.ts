import type { LikeRepository, PostRepository } from "./ports";
import { requirePost } from "./require-post";

/** 投稿へのいいねを外す。外れるのは自分のいいねだけ */
export const unlikePost = (deps: { likes: LikeRepository; postRepository: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePost(deps.postRepository, input.postId);
		await deps.likes.remove({ postId: input.postId, userId: input.accountId });
	};
};

export type UnlikePost = ReturnType<typeof unlikePost>;
