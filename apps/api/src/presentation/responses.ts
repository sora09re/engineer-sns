import type {
	LoginUser as LoginUserResponse,
	PostType,
	ProfileType,
	User as UserResponse,
} from "@engineer-sns/shared";

import type { PostSummary } from "../application/post-summary";
import type { UserProfile } from "../application/user-profile";
import type { User } from "../domain/user";

export const toUserResponse = (user: User): UserResponse => {
	return {
		id: user.id,
		bio: user.bio,
		created_at: user.createdAt.toISOString(),
		location: user.location,
		name: user.name,
		profile_image_url: user.profileImageUrl,
		updated_at: user.updatedAt.toISOString(),
		username: user.username,
		website: user.website,
	};
};

export const toLoginUserResponse = (user: User): LoginUserResponse => {
	return { ...toUserResponse(user), email: user.email };
};

export const toPostType = (summary: PostSummary): PostType => {
	const { post, author } = summary;
	return {
		id: post.id,
		can_delete: summary.canDelete,
		comment_count: summary.commentCount,
		content: post.content,
		created_at: post.createdAt.toISOString(),
		is_liked: summary.isLiked,
		like_count: summary.likeCount,
		parent_post_id: post.parentPostId,
		user_id: post.authorId,
		users: toUserResponse(author),
	};
};

export const toProfileType = (profile: UserProfile): ProfileType => {
	return {
		...toUserResponse(profile.user),
		follower_count: profile.followerCount,
		followee_count: profile.followeeCount,
	};
};
