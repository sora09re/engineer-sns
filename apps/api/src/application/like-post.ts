import type { LikeRepository, PostRepository, UserRepository } from "./ports";
import { requireLoginUser } from "./require-login-user";

/** 投稿にいいねする */
export const likePost = (deps: {
	users: UserRepository;
	likes: LikeRepository;
	posts: PostRepository;
}) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requireLoginUser(deps, input);
		await deps.likes.add({ postId: input.postId, userId: input.accountId });
	};
};

export type LikePost = ReturnType<typeof likePost>;
