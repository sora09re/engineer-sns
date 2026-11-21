import type { Like } from "../domain/like";
import type { Post } from "../domain/post";
import type { User } from "../domain/user";

export type PostSummary = {
	post: Post;
	author: User;
	likes: Like[];
	commentCount: number;
};
