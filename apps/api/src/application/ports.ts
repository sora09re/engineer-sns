/**
 * application が外側（infrastructure）に求めるもの。実装は infrastructure に置き、app.ts で組み立てる。
 */
import type { Post } from "../domain/post";
import type { User, UserValues } from "../domain/user";
import type { PostSummary } from "./post-summary";
import type { UserProfile } from "./user-profile";

export type FollowRepository = {
	/** followerId のユーザーがフォローしているユーザー（followee）の ID */
	findFolloweeIds: (followerId: string) => Promise<string[]>;
	/** followerId のユーザーが followeeId のユーザーをフォローしているか */
	exists: (values: { followerId: string; followeeId: string }) => Promise<boolean>;
	/** フォローする。すでにフォローしていれば何もしない */
	add: (values: { followerId: string; followeeId: string }) => Promise<void>;
	/** フォローを外す。フォローしていなければ何もしない */
	remove: (values: { followerId: string; followeeId: string }) => Promise<void>;
};

export type PostQuery = {
	/** authorIds のユーザーが書いた、コメントでない投稿を新しい順に返す */
	findTopLevelByAuthors: (authorIds: string[]) => Promise<PostSummary[]>;
	/** ID で投稿（コメントを含む）を 1 件返す。なければ null */
	findById: (postId: string) => Promise<PostSummary | null>;
	/** postId の投稿へのコメントを新しい順に返す */
	findCommentsOf: (postId: string) => Promise<PostSummary[]>;
	/** authorId のユーザーが書いた投稿（コメントを含む）を新しい順に返す */
	findByAuthor: (authorId: string) => Promise<PostSummary[]>;
	/** 本文に keyword を含む（大文字と小文字は区別しない）、コメントでない投稿を新しい順に返す */
	searchTopLevel: (keyword: string) => Promise<PostSummary[]>;
};

export type UserQuery = {
	findById: (userId: string) => Promise<User | null>;
	/** フォロワー数とフォロー数つきのユーザー。なければ null */
	findProfile: (userId: string) => Promise<UserProfile | null>;
	/** userId のユーザーをフォローしているユーザー。フォローした順（古い順）、同じ時刻ならユーザー名順 */
	findFollowersOf: (userId: string) => Promise<User[]>;
	/** 名前・ユーザーネーム・自己紹介のどれかに keyword を含む（大文字と小文字は区別しない）ユーザー */
	search: (keyword: string) => Promise<User[]>;
	/** userId のユーザーがフォローしているユーザー。並び順は findFollowersOf と同じ */
	findFolloweesOf: (userId: string) => Promise<User[]>;
};

export type UserRepository = {
	/** そのアカウントがユーザーを持っているか（新規ユーザー登録が済んでいるか） */
	exists: (userId: string) => Promise<boolean>;
	/** そのユーザーネームを使っているユーザーの ID。いなければ null */
	findIdByUsername: (username: string) => Promise<string | null>;
	/** アカウントにユーザーを作る。ユーザーの ID はアカウントの ID と同じ */
	create: (values: UserValues & { id: string }) => Promise<User>;
	/** ユーザーの項目を変える。渡された項目だけを変える */
	update: (userId: string, values: Partial<UserValues>) => Promise<User>;
};

/** 書き込み用。domain の Post を扱う */
export type PostRepository = {
	findById: (postId: string) => Promise<Post | null>;
	create: (values: { authorId: string; content: string; parentPostId?: string }) => Promise<Post>;
	/** 投稿を削除する。コメントも消える */
	delete: (postId: string) => Promise<void>;
};

export type LikeRepository = {
	/** userId のユーザーの、postId の投稿へのいいねを付ける。すでにあれば何もしない */
	add: (values: { postId: string; userId: string }) => Promise<void>;
	/** userId のユーザーの、postId の投稿へのいいねを外す。なければ何もしない */
	remove: (values: { postId: string; userId: string }) => Promise<void>;
};

/** アクセストークンを検証し、アカウント ID を返す。不正なら null */
export type AccessTokenVerifier = (token: string) => Promise<{ accountId: string } | null>;
