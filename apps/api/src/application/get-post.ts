import { NotFoundError } from "./errors";
import type { PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

/** 投稿を 1 件返す。コメントも投稿として返す。なければ NotFoundError */
export const getPost = (deps: { posts: PostRepository }) => {
	return async (postId: string): Promise<PostSummary> => {
		const post = await deps.posts.findSummaryById(postId);
		if (!post) {
			throw new NotFoundError("投稿が見つかりません。");
		}
		return post;
	};
};
