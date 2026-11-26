import { createComment } from "./create-comment";
import { createPost } from "./create-post";
import { deletePost } from "./delete-post";
import { followUser } from "./follow-user";
import { getComments } from "./get-comments";
import { getCurrentUser } from "./get-current-user";
import { getFollowees, getFollowers } from "./get-follows";
import { getPost } from "./get-post";
import { getTimeline } from "./get-timeline";
import { getUserPosts } from "./get-user-posts";
import { getUserProfile } from "./get-user-profile";
import { issueProfileImageUpload } from "./issue-profile-image-upload";
import { likePost } from "./like-post";
import type {
	FollowRepository,
	LikeRepository,
	PostRepository,
	ProfileImageStorage,
	UserRepository,
} from "./ports";
import { registerUser } from "./register-user";
import { searchPosts } from "./search-posts";
import { searchUsers } from "./search-users";
import { unfollowUser } from "./unfollow-user";
import { unlikePost } from "./unlike-post";
import { updateCurrentUser } from "./update-current-user";

export type Ports = {
	follows: FollowRepository;
	likes: LikeRepository;
	posts: PostRepository;
	users: UserRepository;
	storage: ProfileImageStorage;
};

export const createUseCases = (ports: Ports) => {
	return {
		getTimeline: getTimeline(ports),
		getPost: getPost(ports),
		getComments: getComments(ports),
		getUserPosts: getUserPosts(ports),
		searchPosts: searchPosts(ports),
		createPost: createPost(ports),
		createComment: createComment(ports),
		deletePost: deletePost(ports),
		likePost: likePost(ports),
		unlikePost: unlikePost(ports),
		followUser: followUser(ports),
		unfollowUser: unfollowUser(ports),
		getFollowers: getFollowers(ports),
		getFollowees: getFollowees(ports),
		getCurrentUser: getCurrentUser(ports),
		getUserProfile: getUserProfile(ports),
		searchUsers: searchUsers(ports),
		registerUser: registerUser(ports),
		updateCurrentUser: updateCurrentUser(ports),
		issueProfileImageUpload: issueProfileImageUpload(ports),
	};
};

export type UseCases = ReturnType<typeof createUseCases>;
