import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUser } from "./require-target-user";

export const isFollowing = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<boolean> => {
		await requireTargetUser(deps.users, input.userId);
		return deps.follows.exists({ followerId: input.accountId, followeeId: input.userId });
	};
};
