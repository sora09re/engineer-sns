import { canFollow } from "../domain/follow";
import { ValidationError } from "./errors";
import type { FollowRepository, UserRepository } from "./ports";
import { requireLoginUser } from "./require-login-user";

/** ユーザーをフォローする。フォローする側（follower）はログイン中のユーザー */
export const followUser = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<void> => {
		await requireLoginUser(deps, input);
		const follow = { followerId: input.accountId, followeeId: input.userId };
		if (!canFollow(follow)) {
			throw new ValidationError("自分はフォローできません。");
		}
		await deps.follows.add(follow);
	};
};
