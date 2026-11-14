import { NotFoundError } from "./errors";
import type { UserRepository } from "./ports";

/** 操作の相手のユーザーが存在すること。なければ NotFoundError */
export const requireTargetUser = async (users: UserRepository, userId: string) => {
	if (!(await users.exists(userId))) {
		throw new NotFoundError("ユーザーが見つかりません。");
	}
};
