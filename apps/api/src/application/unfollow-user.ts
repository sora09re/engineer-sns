import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUserEvenWithoutUser } from "./require-login-user";

export const unfollowUser = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<void> => {
		await requireTargetUserEvenWithoutUser(deps, input);
		await deps.follows.remove({ followerId: input.accountId, followeeId: input.userId });
	};
};
