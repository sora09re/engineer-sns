/** プロフィールの読み取りモデルを、API のレスポンスの形（packages/shared の ProfileType）にする */
import type { ProfileType } from "@engineer-sns/shared";

import type { UserProfile } from "../../application/user-profile";
import { toUserResponse } from "./post-type";

export const toProfileType = (profile: UserProfile): ProfileType => {
	return {
		...toUserResponse(profile.user),
		follower_count: profile.followerCount,
		followee_count: profile.followeeCount,
	};
};
