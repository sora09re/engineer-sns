import type { User } from "./user";

export type ProfileType = User & {
	follower_count: number;
	followee_count: number;
};
