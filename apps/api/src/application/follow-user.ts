import { canFollow } from "../domain/follow";
import { ValidationError } from "./errors";
import type { FollowRepository, UserRepository } from "./ports";
import { requireTargetUser } from "./require-target-user";
import { requireUser } from "./require-user";

/** ユーザーをフォローする。フォローする側（follower）はログイン中のアカウントのユーザー */
export const followUser = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<void> => {
		await requireTargetUser(deps.users, input.userId);
		const follow = { followerId: input.accountId, followeeId: input.userId };
		if (!canFollow(follow)) {
			throw new ValidationError("自分はフォローできません。");
		}
		await requireUser(deps.users, input.accountId);
		await deps.follows.add(follow);
	};
};

export type FollowUser = ReturnType<typeof followUser>;
