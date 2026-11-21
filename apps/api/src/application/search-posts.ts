import type { PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

export const searchPosts = (deps: { posts: PostRepository }) => {
	return async (keyword: string): Promise<PostSummary[]> => {
		if (!keyword.trim()) {
			return [];
		}
		return deps.posts.searchTopLevel(keyword);
	};
};
