import type { LikeRepository, PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-post";
import { requireUser } from "./require-user";

/** 投稿にいいねする */
export const likePost = (deps: {
	users: UserRepository;
	likes: LikeRepository;
	postRepository: PostRepository;
}) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		await requirePost(deps.postRepository, input.postId);
		await requireUser(deps.users, input.accountId);
		await deps.likes.add({ postId: input.postId, userId: input.accountId });
	};
};

export type LikePost = ReturnType<typeof likePost>;
