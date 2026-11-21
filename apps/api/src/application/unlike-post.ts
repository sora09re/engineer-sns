import type { LikeRepository, PostRepository } from "./ports";
import { requirePost } from "./require-post";

export const unlikePost = (deps: { likes: LikeRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePost(deps.posts, input.postId);
		await deps.likes.remove({ postId: input.postId, userId: input.accountId });
	};
};
