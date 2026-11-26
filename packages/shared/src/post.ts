import type { User } from "./user";

export type PostType = {
	id: string;
	can_delete: boolean;
	comment_count: number;
	content: string;
	created_at: string;
	is_liked: boolean;
	like_count: number;
	parent_post_id: string | null;
	user_id: string;
	users: User;
};
