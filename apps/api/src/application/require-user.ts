import { ForbiddenError } from "./errors";
import type { UserRepository } from "./ports";

/** アカウントがユーザーを持っていること。投稿やいいねはユーザーの名義で行うので、新規ユーザー登録の前はできない */
export const requireUser = async (users: UserRepository, accountId: string) => {
	if (!(await users.exists(accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
};
