import type { PostQuery } from "./ports";
import type { PostSummary } from "./post-summary";

/** 投稿を 1 件返す。コメントも投稿として返す。なければ null */
export const getPost = (deps: { posts: PostQuery }) => {
	return (postId: string): Promise<PostSummary | null> => {
		return deps.posts.findById(postId);
	};
};

export type GetPost = ReturnType<typeof getPost>;
