import type { User } from "../domain/user";
import type { UserQuery } from "./ports";

/** ユーザーの検索: 名前・ユーザーネーム・自己紹介のどれかにキーワードを含むユーザー。キーワードが空白だけなら何も返さない */
export const searchUsers = (deps: { userQuery: UserQuery }) => {
	return async (keyword: string): Promise<User[]> => {
		if (!keyword.trim()) {
			return [];
		}
		return deps.userQuery.search(keyword);
	};
};

export type SearchUsers = ReturnType<typeof searchUsers>;
