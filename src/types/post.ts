import type { Like } from "@/types/like";
import type { User } from "@/types/user";

/** 投稿。parent_post_id を持つものはコメント */
export type PostType = {
	id: string;
	comment_count: number;
	content: string;
	created_at: string;
	likes: Like[];
	parent_post_id: string | null;
	user_id: string;
	users: User;
};
