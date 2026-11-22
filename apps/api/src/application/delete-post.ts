import type { PostRepository, UserRepository } from "./ports";
import { requireDeletablePost } from "./require-login-user";

export const deletePost = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		const post = await requireDeletablePost(deps, input);
		await deps.posts.delete(post.id);
	};
};
