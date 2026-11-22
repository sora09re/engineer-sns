import { canDeletePost } from "../domain/post";
import type { PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-login-user";

export const deletePost = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<void> => {
		const post = await requirePost(deps, input, {
			by: "loginUser",
			authorization: { allows: canDeletePost, message: "この投稿は削除できません。" },
		});
		await deps.posts.delete(post.id);
	};
};
