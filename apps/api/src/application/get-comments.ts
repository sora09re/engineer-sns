import type { PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

export const getComments = (deps: { posts: PostRepository }) => {
	return (postId: string): Promise<PostSummary[]> => {
		return deps.posts.findCommentsOf(postId);
	};
};
