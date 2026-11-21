import type { PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

export const getUserPosts = (deps: { posts: PostRepository }) => {
	return (userId: string): Promise<PostSummary[]> => {
		return deps.posts.findByAuthor(userId);
	};
};
