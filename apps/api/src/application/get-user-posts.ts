import type { PostQuery } from "./ports";
import type { PostSummary } from "./post-summary";

/** ユーザーが書いた投稿を、コメントも含めて新しい順に返す */
export const getUserPosts = (deps: { posts: PostQuery }) => {
	return (userId: string): Promise<PostSummary[]> => {
		return deps.posts.findByAuthor(userId);
	};
};

export type GetUserPosts = ReturnType<typeof getUserPosts>;
