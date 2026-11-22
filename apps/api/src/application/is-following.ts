import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUser } from "./require-login-user";

export const isFollowing = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<boolean> => {
		await requireTargetUser(deps, input, { by: "account" });
		return deps.follows.exists({ followerId: input.accountId, followeeId: input.userId });
	};
};
