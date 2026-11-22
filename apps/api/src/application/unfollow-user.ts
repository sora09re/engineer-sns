import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUser } from "./require-login-user";

export const unfollowUser = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<void> => {
		await requireTargetUser(deps, input, { by: "account" });
		await deps.follows.remove({ followerId: input.accountId, followeeId: input.userId });
	};
};
