import { ConflictError } from "./errors";
import type { UserRepository } from "./ports";

/** ユーザーネームがほかのユーザーに使われていないこと。自分がいま使っているものはよい */
export const assertUsernameAvailable = async (
	users: UserRepository,
	input: { accountId: string; username: string },
) => {
	const ownerId = await users.findIdByUsername(input.username);
	if (ownerId && ownerId !== input.accountId) {
		throw new ConflictError("このユーザーネームはすでに使われています。");
	}
};
