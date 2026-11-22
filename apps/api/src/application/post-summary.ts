import type { Like } from "../domain/like";
import { type Post, canDeletePost } from "../domain/post";
import type { User } from "../domain/user";

export type PostRecord = {
	post: Post;
	author: User;
	likes: Like[];
	commentCount: number;
};

export type PostSummary = {
	post: Post;
	author: User;
	likeCount: number;
	isLiked: boolean;
	canDelete: boolean;
	commentCount: number;
};

export const toPostSummary = (
	{ post, author, likes, commentCount }: PostRecord,
	accountId: string,
): PostSummary => {
	return {
		post,
		author,
		likeCount: likes.length,
		isLiked: likes.some((like) => like.userId === accountId),
		canDelete: canDeletePost(post, accountId),
		commentCount,
	};
};
