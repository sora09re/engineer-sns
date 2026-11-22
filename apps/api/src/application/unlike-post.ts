import type { LikeRepository, PostRepository } from "./ports";
import { requirePostEvenWithoutUser } from "./require-login-user";

export const unlikePost = (deps: { likes: LikeRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePostEvenWithoutUser(deps, input);
		await deps.likes.remove({ postId: input.postId, userId: input.accountId });
	};
};
