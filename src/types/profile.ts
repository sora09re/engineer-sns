import type { User } from "@/types/user";

export type ProfileType = User & {
	/** このユーザーをフォローしているユーザー数 */
	follower_count: number;
	/** このユーザーがフォローしているユーザー数 */
	followee_count: number;
};
