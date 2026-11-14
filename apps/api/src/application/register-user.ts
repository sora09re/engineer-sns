import { findUserValuesError, type User, type UserValues } from "../domain/user";
import { assertUsernameAvailable } from "./assert-username-available";
import { ConflictError, ValidationError } from "./errors";
import type { UserRepository } from "./ports";

/** 新規ユーザー登録: ログイン中のアカウントにユーザーを作る */
export const registerUser = (deps: { users: UserRepository }) => {
	return async (input: { accountId: string; values: UserValues }): Promise<User> => {
		const error = findUserValuesError(input.values);
		if (error) {
			throw new ValidationError(error);
		}
		if (await deps.users.exists(input.accountId)) {
			throw new ConflictError("新規ユーザー登録は済んでいます。");
		}
		await assertUsernameAvailable(deps.users, {
			accountId: input.accountId,
			username: input.values.username,
		});
		return deps.users.create({ ...input.values, id: input.accountId });
	};
};

export type RegisterUser = ReturnType<typeof registerUser>;
