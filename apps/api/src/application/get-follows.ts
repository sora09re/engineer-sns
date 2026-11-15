import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

/** フォロワー: userId のユーザーをフォローしているユーザー */
export const getFollowers = (deps: { users: UserRepository }) => {
	return (userId: string): Promise<User[]> => {
		return deps.users.findFollowersOf(userId);
	};
};

/** フォロー: userId のユーザーがフォローしているユーザー */
export const getFollowees = (deps: { users: UserRepository }) => {
	return (userId: string): Promise<User[]> => {
		return deps.users.findFolloweesOf(userId);
	};
};
