import { NotFoundError } from "./errors";
import type { UserRepository } from "./ports";

export const requireTargetUser = async (users: UserRepository, userId: string) => {
	if (!(await users.exists(userId))) {
		throw new NotFoundError("ユーザーが見つかりません。");
	}
};
