import type { PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

/** ユーザーが書いた投稿を、コメントも含めて新しい順に返す */
export const getUserPosts = (deps: { posts: PostRepository }) => {
	return (userId: string): Promise<PostSummary[]> => {
		return deps.posts.findByAuthor(userId);
	};
};
