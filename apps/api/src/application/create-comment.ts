import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";
import { requireLoginUser } from "./require-login-user";

export const createComment = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: {
		accountId: string;
		postId: string;
		content: string;
	}): Promise<PostSummary> => {
		const parent = await requireLoginUser(deps, {
			accountId: input.accountId,
			postId: input.postId,
		});
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		return deps.posts.create({
			authorId: input.accountId,
			content: input.content,
			parentPostId: parent.id,
		});
	};
};
