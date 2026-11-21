import type { FollowRepository, PostRepository } from "./ports";
import type { PostSummary } from "./post-summary";

export const getTimeline = (deps: { follows: FollowRepository; posts: PostRepository }) => {
	return async (accountId: string): Promise<PostSummary[]> => {
		const followeeIds = await deps.follows.findFolloweeIds(accountId);
		return deps.posts.findTopLevelByAuthors([accountId, ...followeeIds]);
	};
};
