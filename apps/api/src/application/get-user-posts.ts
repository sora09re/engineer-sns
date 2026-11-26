import type { PostRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";

export const getUserPosts = (deps: { posts: PostRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<PostSummary[]> => {
		const posts = await deps.posts.findByAuthor(input.userId);
		return posts.map((post) => toPostSummary(post, input.accountId));
	};
};
