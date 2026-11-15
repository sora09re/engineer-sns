import { NotFoundError } from "./errors";
import type { UserQuery } from "./ports";
import type { UserProfile } from "./user-profile";

/** ユーザーのプロフィール。なければ NotFoundError */
export const getUserProfile = (deps: { userQuery: UserQuery }) => {
	return async (userId: string): Promise<UserProfile> => {
		const profile = await deps.userQuery.findProfile(userId);
		if (!profile) {
			throw new NotFoundError("ユーザーが見つかりません。");
		}
		return profile;
	};
};

export type GetUserProfile = ReturnType<typeof getUserProfile>;
