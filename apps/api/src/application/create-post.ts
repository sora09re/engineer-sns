import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";
import { requireLoginUser } from "./require-login-user";

/** 投稿する。投稿者は常にログイン中のアカウントのユーザー */
export const createPost = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: { accountId: string; content: string }): Promise<PostSummary> => {
		await requireLoginUser(deps, { accountId: input.accountId });
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		return deps.posts.create({
			authorId: input.accountId,
			content: input.content,
		});
	};
};
