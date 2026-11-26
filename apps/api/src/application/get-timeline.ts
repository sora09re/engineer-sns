import type { FollowRepository, PostRepository } from "./ports";
import { type PostSummary, toPostSummary } from "./post-summary";

export const getTimeline = (deps: { follows: FollowRepository; posts: PostRepository }) => {
	return async (accountId: string): Promise<PostSummary[]> => {
		const followeeIds = await deps.follows.findFolloweeIds(accountId);
		const posts = await deps.posts.findTopLevelByAuthors([accountId, ...followeeIds]);
		return posts.map((post) => toPostSummary(post, accountId));
	};
};
