import { NotFoundError } from "./errors";
import type { PostRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";

export const getPost = (deps: { posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<PostSummary> => {
		const post = await deps.posts.findSummaryById(input.postId);
		if (!post) {
			throw new NotFoundError("投稿が見つかりません。");
		}
		return toPostSummary(post, input.accountId);
	};
};
