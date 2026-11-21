import type { User } from "../domain/user";

export type UserProfile = {
	user: User;
	followerCount: number;
	followeeCount: number;
};
