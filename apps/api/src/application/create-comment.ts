import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";
import { requirePost } from "./require-login-user";

export const createComment = (deps: { users: UserRepository; posts: PostRepository }) => {
	return async (input: {
		accountId: string;
		postId: string;
		content: string;
	}): Promise<PostSummary> => {
		const parent = await requirePost(deps, input, { by: "loginUser" });
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		const post = await deps.posts.create({
			authorId: input.accountId,
			content: input.content,
			parentPostId: parent.id,
		});
		return toPostSummary(post, input.accountId);
	};
};
