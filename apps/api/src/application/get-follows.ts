import type { User } from "../domain/user";
import type { UserQuery } from "./ports";

/** フォロワー: userId のユーザーをフォローしているユーザー */
export const getFollowers = (deps: { userQuery: UserQuery }) => {
	return (userId: string): Promise<User[]> => {
		return deps.userQuery.findFollowersOf(userId);
	};
};

/** フォロー: userId のユーザーがフォローしているユーザー */
export const getFollowees = (deps: { userQuery: UserQuery }) => {
	return (userId: string): Promise<User[]> => {
		return deps.userQuery.findFolloweesOf(userId);
	};
};

export type GetFollowers = ReturnType<typeof getFollowers>;
export type GetFollowees = ReturnType<typeof getFollowees>;
