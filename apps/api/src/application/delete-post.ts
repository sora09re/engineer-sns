import { canDeletePost } from "../domain/post";
import { ForbiddenError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import { requireLoginUser } from "./require-login-user";

export const deletePost = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		const post = await requireLoginUser(deps, input);
		if (!canDeletePost(post, input.accountId)) {
			throw new ForbiddenError("この投稿は削除できません。");
		}
		await deps.posts.delete(post.id);
	};
};
