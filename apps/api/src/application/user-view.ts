import { canFollow } from "../domain/follow";
import type { User } from "../domain/user";
import type { FollowRepository, UserRepository } from "./ports";

export type UserView = {
	user: User;
	isFollowing: boolean;
	canFollow: boolean;
};

type Deps = { users: UserRepository; follows: FollowRepository };

type Viewer = { accountId: string; hasUser: boolean };

const toUserView = (user: User, viewer: Viewer, isFollowing: boolean): UserView => {
	return {
		user,
		isFollowing,
		canFollow: viewer.hasUser && canFollow({ followerId: viewer.accountId, followeeId: user.id }),
	};
};

export const viewUsers = async (
	deps: Deps,
	input: { accountId: string; users: User[] },
): Promise<UserView[]> => {
	if (input.users.length === 0) {
		return [];
	}
	const [hasUser, followeeIds] = await Promise.all([
		deps.users.exists(input.accountId),
		deps.follows.findFolloweeIds(input.accountId),
	]);
	const viewer = { accountId: input.accountId, hasUser };
	const followees = new Set(followeeIds);
	return input.users.map((user) => toUserView(user, viewer, followees.has(user.id)));
};

export const viewUser = async (
	deps: Deps,
	input: { accountId: string; user: User },
): Promise<UserView> => {
	const [hasUser, isFollowing] = await Promise.all([
		deps.users.exists(input.accountId),
		deps.follows.exists({ followerId: input.accountId, followeeId: input.user.id }),
	]);
	return toUserView(input.user, { accountId: input.accountId, hasUser }, isFollowing);
};
