import type { Like } from "../domain/like";
import type { Post } from "../domain/post";
import type { User } from "../domain/user";

/** 一覧に出す投稿。投稿者・いいね・コメント数をまとめた読み取りモデル */
export type PostSummary = {
	post: Post;
	author: User;
	likes: Like[];
	commentCount: number;
};
