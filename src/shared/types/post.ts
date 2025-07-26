import type { Like } from "@/shared/types/like";
import type { User } from "@/shared/types/user";

export type PostType = {
	id: string;
	comments: PostType[];
	content: string;
	created_at: Date;
	is_deleted: boolean;
	likes: Like[];
	parent_post_id?: string | null;
	updated_at: Date;
	user_id: string;
	users: User;
};

export type PostProps = {
	post: PostType;
};
