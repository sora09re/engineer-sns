import { isValidPostContent } from "../domain/post";
import { ForbiddenError, ValidationError } from "./errors";
import type { UserRepository } from "./ports";

/**
 * 投稿・コメントを書く前提。本文が空白だけでないこと、アカウントがユーザーを持っていること
 * （投稿はユーザーの名義で行うので、新規ユーザー登録の前は書けない）
 */
export const assertCanWrite = async (
	users: UserRepository,
	input: { accountId: string; content: string },
) => {
	if (!isValidPostContent(input.content)) {
		throw new ValidationError("本文を入力してください。");
	}
	if (!(await users.exists(input.accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
};
