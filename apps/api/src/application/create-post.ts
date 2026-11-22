import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";
import { requireLoginUser } from "./require-login-user";

export const createPost = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; content: string }): Promise<PostSummary> => {
		await requireLoginUser(deps, { accountId: input.accountId });
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		const post = await deps.posts.create({
			authorId: input.accountId,
			content: input.content,
		});
		return toPostSummary(post, input.accountId);
	};
};
