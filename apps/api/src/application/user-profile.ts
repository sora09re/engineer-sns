import type { User } from "../domain/user";
import type { UserView } from "./user-view";

export type UserProfileRecord = {
	user: User;
	followerCount: number;
	followeeCount: number;
};

export type UserProfile = UserView & {
	followerCount: number;
	followeeCount: number;
};
