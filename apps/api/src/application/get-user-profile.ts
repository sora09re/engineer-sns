import { NotFoundError } from "./errors";
import type { UserRepository } from "./ports";
import type { UserProfile } from "./user-profile";

export const getUserProfile = (deps: { users: UserRepository }) => {
	return async (userId: string): Promise<UserProfile> => {
		const profile = await deps.users.findProfile(userId);
		if (!profile) {
			throw new NotFoundError("ユーザーが見つかりません。");
		}
		return profile;
	};
};
