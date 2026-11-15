import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

/** ログイン中のアカウントのユーザー。新規ユーザー登録の前なら null */
export const getCurrentUser = (deps: { users: UserRepository }) => {
	return (accountId: string): Promise<User | null> => {
		return deps.users.findById(accountId);
	};
};
