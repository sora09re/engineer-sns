import type { PostRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";

export const searchPosts = (deps: { posts: PostRepository }) => {
	return async (input: { accountId: string; keyword: string }): Promise<PostSummary[]> => {
		if (!input.keyword.trim()) {
			return [];
		}
		const posts = await deps.posts.searchTopLevel(input.keyword);
		return posts.map((post) => toPostSummary(post, input.accountId));
	};
};
