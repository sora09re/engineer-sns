import type { LikeRepository, PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-login-user";

export const likePost = (deps: {
	users: UserRepository;
	likes: LikeRepository;
	posts: PostRepository;
}) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePost(deps, input);
		await deps.likes.add({ postId: input.postId, userId: input.accountId });
	};
};
