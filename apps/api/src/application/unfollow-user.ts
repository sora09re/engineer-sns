import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUser } from "./require-target-user";

/** フォローを外す。外れるのは自分（follower）のフォローだけ */
export const unfollowUser = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<void> => {
		await requireTargetUser(deps.users, input.userId);
		await deps.follows.remove({ followerId: input.accountId, followeeId: input.userId });
	};
};

export type UnfollowUser = ReturnType<typeof unfollowUser>;
