export type User = {
	id: string;
	bio?: string;
	created_at: string;
	location?: string;
	name: string;
	profile_image_url?: string;
	updated_at: string;
	username: string;
	website?: string;
};

export type UserView = User & {
	can_follow: boolean;
	is_following: boolean;
};

export type LoginUser = User & {
	email: string;
};

export type UserValues = Pick<
	LoginUser,
	"bio" | "email" | "location" | "name" | "profile_image_url" | "username" | "website"
>;
