import type { Follow } from "@/shared/entities";
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
