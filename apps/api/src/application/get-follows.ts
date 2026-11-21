import type { User } from "../domain/user";
import type { UserRepository } from "./ports";

export const getFollowers = (deps: { users: UserRepository }) => {
	return (userId: string): Promise<User[]> => {
		return deps.users.findFollowersOf(userId);
	};
};

export const getFollowees = (deps: { users: UserRepository }) => {
	return (userId: string): Promise<User[]> => {
		return deps.users.findFolloweesOf(userId);
	};
};
