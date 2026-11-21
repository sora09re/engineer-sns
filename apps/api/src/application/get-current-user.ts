import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

export const getCurrentUser = (deps: { users: UserRepository }) => {
	return (accountId: string): Promise<User | null> => {
		return deps.users.findById(accountId);
	};
};
