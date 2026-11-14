/** ユーザー: アカウントに紐づく SNS 上の人格 */
export type User = {
	id: string;
	bio?: string;
	created_at: string;
	email: string;
	location?: string;
	name: string;
	profile_image_url?: string;
	updated_at: string;
	username: string;
	website?: string;
};

/** ユーザーが編集できる項目 */
export type UserValues = Pick<
	User,
	"bio" | "email" | "location" | "name" | "profile_image_url" | "username" | "website"
>;
