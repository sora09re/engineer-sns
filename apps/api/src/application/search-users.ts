import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

/** ユーザーの検索: 名前・ユーザーネーム・自己紹介のどれかにキーワードを含むユーザー。キーワードが空白だけなら何も返さない */
export const searchUsers = (deps: { users: UserRepository }) => {
	return async (keyword: string): Promise<User[]> => {
		if (!keyword.trim()) {
			return [];
		}
		return deps.users.search(keyword);
	};
};
