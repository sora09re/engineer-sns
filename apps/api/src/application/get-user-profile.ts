import { NotFoundError } from "./errors";
import type { FollowRepository, UserRepository } from "./ports";
import type { UserProfile } from "./user-profile";
import { viewUser } from "./user-view";

export const getUserProfile = (deps: { users: UserRepository; follows: FollowRepository }) => {
	return async (input: { accountId: string; userId: string }): Promise<UserProfile> => {
		const profile = await deps.users.findProfile(input.userId);
		if (!profile) {
			throw new NotFoundError("ユーザーが見つかりません。");
		}
		const view = await viewUser(deps, { accountId: input.accountId, user: profile.user });
		return { ...view, followerCount: profile.followerCount, followeeCount: profile.followeeCount };
	};
};
