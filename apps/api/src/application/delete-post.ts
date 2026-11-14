import { canDeletePost } from "../domain/post";
import { ForbiddenError } from "./errors";
import type { PostRepository } from "./ports";
import { requirePost } from "./require-post";

/** 投稿を削除する。削除できるのは投稿者だけで、コメントも一緒に消える */
export const deletePost = (deps: { postRepository: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		const post = await requirePost(deps.postRepository, input.postId);
		if (!canDeletePost(post, input.accountId)) {
			throw new ForbiddenError("この投稿は削除できません。");
		}
		await deps.postRepository.delete(post.id);
	};
};

export type DeletePost = ReturnType<typeof deletePost>;
