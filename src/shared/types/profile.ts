import type { Follow } from "@/shared/types/follow";
import type { PostType } from "@/shared/types/post";

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
