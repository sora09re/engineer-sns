import type { FollowRepository, UserRepository } from "./ports";
import { type UserView, viewUsers } from "./user-view";

type Deps = { users: UserRepository; follows: FollowRepository };
type Input = { accountId: string; userId: string };

export const getFollowers = (deps: Deps) => {
	return async (input: Input): Promise<UserView[]> => {
		const users = await deps.users.findFollowersOf(input.userId);
		return viewUsers(deps, { accountId: input.accountId, users });
	};
};

export const getFollowees = (deps: Deps) => {
	return async (input: Input): Promise<UserView[]> => {
		const users = await deps.users.findFolloweesOf(input.userId);
		return viewUsers(deps, { accountId: input.accountId, users });
	};
};
