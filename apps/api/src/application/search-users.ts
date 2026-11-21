import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

export const searchUsers = (deps: { users: UserRepository }) => {
	return async (keyword: string): Promise<User[]> => {
		if (!keyword.trim()) {
			return [];
		}
		return deps.users.search(keyword);
	};
};
