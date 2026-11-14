/** application の読み取りモデルを、API のレスポンスの形（packages/shared の PostType）にする */
import type { PostType, User as UserResponse } from "@engineer-sns/shared";

import type { PostSummary } from "../../application/post-summary";
import type { User } from "../../domain/user";

export const toUserResponse = (user: User): UserResponse => {
	return {
		id: user.id,
		bio: user.bio,
		created_at: user.createdAt.toISOString(),
		email: user.email,
		location: user.location,
		name: user.name,
		profile_image_url: user.profileImageUrl,
		updated_at: user.updatedAt.toISOString(),
		username: user.username,
		website: user.website,
	};
};

export const toPostType = ({ post, author, likes, commentCount }: PostSummary): PostType => {
	return {
		id: post.id,
		comment_count: commentCount,
		content: post.content,
		created_at: post.createdAt.toISOString(),
		likes: likes.map((like) => {
			return { id: like.id, post_id: like.postId, user_id: like.userId };
		}),
		parent_post_id: post.parentPostId,
		user_id: post.authorId,
		users: toUserResponse(author),
	};
};
