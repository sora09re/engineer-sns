import type { PostQuery } from "./ports";
import type { PostSummary } from "./post-summary";

/** 投稿へのコメントを新しい順に返す。投稿がなければ空 */
export const getComments = (deps: { posts: PostQuery }) => {
	return (postId: string): Promise<PostSummary[]> => {
		return deps.posts.findCommentsOf(postId);
	};
};

export type GetComments = ReturnType<typeof getComments>;
