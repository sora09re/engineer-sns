import type { UserQuery } from "./ports";
import type { UserProfile } from "./user-profile";

/** ユーザーのプロフィール。なければ null */
export const getUserProfile = (deps: { userQuery: UserQuery }) => {
	return (userId: string): Promise<UserProfile | null> => {
		return deps.userQuery.findProfile(userId);
	};
};

export type GetUserProfile = ReturnType<typeof getUserProfile>;
