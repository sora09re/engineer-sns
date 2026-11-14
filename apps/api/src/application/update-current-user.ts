import { findUserValuesError, type User, type UserValues } from "../domain/user";
import { assertUsernameAvailable } from "./assert-username-available";
import { ValidationError } from "./errors";
import type { UserRepository } from "./ports";
import { requireUser } from "./require-user";

/** ログイン中のアカウントのユーザーを編集する。渡された項目だけを変える */
export const updateCurrentUser = (deps: { users: UserRepository }) => {
	return async (input: { accountId: string; values: Partial<UserValues> }): Promise<User> => {
		const error = findUserValuesError(input.values);
		if (error) {
			throw new ValidationError(error);
		}
		await requireUser(deps.users, input.accountId);
		if (input.values.username !== undefined) {
			await assertUsernameAvailable(deps.users, {
				accountId: input.accountId,
				username: input.values.username,
			});
		}
		return deps.users.update(input.accountId, input.values);
	};
};

export type UpdateCurrentUser = ReturnType<typeof updateCurrentUser>;
