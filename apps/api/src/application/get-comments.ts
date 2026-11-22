import type { PostRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";

export const getComments = (deps: { posts: PostRepository }) => {
	return async (input: { accountId: string; postId: string }): Promise<PostSummary[]> => {
		const comments = await deps.posts.findCommentsOf(input.postId);
		return comments.map((comment) => toPostSummary(comment, input.accountId));
	};
};
