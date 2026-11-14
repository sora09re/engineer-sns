import type { User } from "../domain/user";

/** プロフィールに出すユーザー。フォロワー数とフォロー数をまとめた読み取りモデル */
export type UserProfile = {
	user: User;
	followerCount: number;
	followeeCount: number;
};
