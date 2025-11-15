import type { PostType } from "@/shared/entities";

export type ProfileType = {
	id: string;
	bio?: string;
	created_at: string;
	email: string;
	follower_user_id: Follow[];
	following_user_id: Follow[];
	location?: string;
	name: string;
	posts: PostType[];
	profile_image_url?: string;
	updated_at: string;
	username: string;
	website?: string;
};

export type Follow = {
	id: string;
	follower_id: string;
	following_id: string;
};
