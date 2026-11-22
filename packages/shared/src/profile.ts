import type { UserView } from "./user";

export type ProfileType = UserView & {
	follower_count: number;
	followee_count: number;
};
