import { canFollow } from "../domain/follow";
import type { User } from "../domain/user";
import type { FollowRepository } from "./ports";

export type UserView = {
	user: User;
	isFollowing: boolean;
	canFollow: boolean;
};

const toUserView = (user: User, accountId: string, isFollowing: boolean): UserView => {
	return {
		user,
		isFollowing,
		canFollow: canFollow({ followerId: accountId, followeeId: user.id }),
	};
};

export const viewUsers = async (
	deps: { follows: FollowRepository },
	input: { accountId: string; users: User[] },
): Promise<UserView[]> => {
	if (input.users.length === 0) {
		return [];
	}
	const followeeIds = new Set(await deps.follows.findFolloweeIds(input.accountId));
	return input.users.map((user) => toUserView(user, input.accountId, followeeIds.has(user.id)));
};

export const viewUser = async (
	deps: { follows: FollowRepository },
	input: { accountId: string; user: User },
): Promise<UserView> => {
	const isFollowing = await deps.follows.exists({
		followerId: input.accountId,
		followeeId: input.user.id,
	});
	return toUserView(input.user, input.accountId, isFollowing);
};
