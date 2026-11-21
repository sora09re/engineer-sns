import type { Post } from "../domain/post";
import type { User, UserValues } from "../domain/user";
import type { PostSummary } from "./post-summary";
import type { UserProfile } from "./user-profile";

export type FollowRepository = {
	findFolloweeIds: (followerId: string) => Promise<string[]>;
	exists: (values: { followerId: string; followeeId: string }) => Promise<boolean>;
	add: (values: { followerId: string; followeeId: string }) => Promise<void>;
	remove: (values: { followerId: string; followeeId: string }) => Promise<void>;
};

export type UserRepository = {
	exists: (userId: string) => Promise<boolean>;
	findById: (userId: string) => Promise<User | null>;
	findProfile: (userId: string) => Promise<UserProfile | null>;
	findFollowersOf: (userId: string) => Promise<User[]>;
	findFolloweesOf: (userId: string) => Promise<User[]>;
	search: (keyword: string) => Promise<User[]>;
	findIdByUsername: (username: string) => Promise<string | null>;
	create: (values: UserValues & { id: string }) => Promise<User>;
	update: (userId: string, values: Partial<UserValues>) => Promise<User>;
};

export type PostRepository = {
	findById: (postId: string) => Promise<Post | null>;
	findSummaryById: (postId: string) => Promise<PostSummary | null>;
	findTopLevelByAuthors: (authorIds: string[]) => Promise<PostSummary[]>;
	findCommentsOf: (postId: string) => Promise<PostSummary[]>;
	findByAuthor: (authorId: string) => Promise<PostSummary[]>;
	searchTopLevel: (keyword: string) => Promise<PostSummary[]>;
	create: (values: {
		authorId: string;
		content: string;
		parentPostId?: string;
	}) => Promise<PostSummary>;
	delete: (postId: string) => Promise<void>;
};

export type LikeRepository = {
	add: (values: { postId: string; userId: string }) => Promise<void>;
	remove: (values: { postId: string; userId: string }) => Promise<void>;
};

export type ProfileImageStorage = {
	createUploadTarget: (path: string) => Promise<{ uploadUrl: string; publicUrl: string }>;
};

export type AccessTokenVerifier = (token: string) => Promise<{ accountId: string } | null>;
