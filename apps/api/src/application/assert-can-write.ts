import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { UserRepository } from "./ports";
import { requireUser } from "./require-user";

/** 投稿・コメントを書く前提。本文が空白だけでないこと、アカウントがユーザーを持っていること */
export const assertCanWrite = async (
	users: UserRepository,
	input: { accountId: string; content: string },
) => {
	if (!isValidPostContent(input.content)) {
		throw new ValidationError("本文を入力してください。");
	}
	await requireUser(users, input.accountId);
};
