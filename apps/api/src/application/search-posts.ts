import type { PostQuery } from "./ports";
import type { PostSummary } from "./post-summary";

/** 投稿の検索: 本文にキーワードを含む、コメントでない投稿を新しい順に返す。キーワードが空白だけなら何も返さない */
export const searchPosts = (deps: { posts: PostQuery }) => {
	return async (keyword: string): Promise<PostSummary[]> => {
		if (!keyword.trim()) {
			return [];
		}
		return deps.posts.searchTopLevel(keyword);
	};
};

export type SearchPosts = ReturnType<typeof searchPosts>;
