import type { User } from "../domain/user";
import type { UserQuery } from "./ports";

/** ログイン中のアカウントのユーザー。新規ユーザー登録の前なら null */
export const getCurrentUser = (deps: { userQuery: UserQuery }) => {
	return (accountId: string): Promise<User | null> => {
		return deps.userQuery.findById(accountId);
	};
};

export type GetCurrentUser = ReturnType<typeof getCurrentUser>;
