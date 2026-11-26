import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUserEvenWithoutUser } from "./require-login-user";

export const isFollowing = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<boolean> => {
		await requireTargetUserEvenWithoutUser(deps, input);
		return deps.follows.exists({ followerId: input.accountId, followeeId: input.userId });
	};
};
