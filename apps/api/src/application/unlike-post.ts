import type { LikeRepository, PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-login-user";

export const unlikePost = (deps: {
	users: UserRepository;
	likes: LikeRepository;
	posts: PostRepository;
}) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePost(deps, input, { by: "account" });
		await deps.likes.remove({ postId: input.postId, userId: input.accountId });
	};
};
