import type { FollowRepository, PostQuery } from "./ports";
import type { PostSummary } from "./post-summary";

/** タイムライン: 自分とフォローしているユーザーの、コメントでない投稿を新しい順に並べたもの */
export const getTimeline = (deps: { follows: FollowRepository; posts: PostQuery }) => {
	return async (accountId: string): Promise<PostSummary[]> => {
		const followeeIds = await deps.follows.findFolloweeIds(accountId);
		return deps.posts.findTopLevelByAuthors([accountId, ...followeeIds]);
	};
};

export type GetTimeline = ReturnType<typeof getTimeline>;
