import type { FollowRepository, UserRepository } from "./ports";
import { type UserView, viewUsers } from "./user-view";

export const searchUsers = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; keyword: string }): Promise<UserView[]> => {
		if (!input.keyword.trim()) {
			return [];
		}
		const users = await deps.users.search(input.keyword);
		return viewUsers(deps, { accountId: input.accountId, users });
	};
};
