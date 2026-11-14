import type { User } from "@/types/user";

import { supabase, throwIfError, unwrap } from "./client";
import { requireAccountId } from "./session";
import { toUser } from "./users";

/** ログイン中のユーザーが userId をフォローしているか */
export const isFollowing = async (userId: string): Promise<boolean> => {
	const accountId = await requireAccountId();
	const rows = unwrap(
		await supabase
			.from("follows")
			.select("id")
			.eq("follower_id", accountId)
			.eq("followee_id", userId)
			.limit(1),
	);
	return rows.length > 0;
};

export const follow = async (userId: string) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("follows").insert({ follower_id: accountId, followee_id: userId }),
	);
};

export const unfollow = async (userId: string) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("follows").delete().eq("follower_id", accountId).eq("followee_id", userId),
	);
};

/** userId をフォローしているユーザー */
export const getFollowers = async (userId: string): Promise<User[]> => {
	const rows = unwrap(
		await supabase
			.from("follows")
			.select("follower:users!follows_follower_id_fkey(*)")
			.eq("followee_id", userId),
	);
	return rows.map((row) => toUser(row.follower));
};

/** userId がフォローしているユーザー */
export const getFollowees = async (userId: string): Promise<User[]> => {
	const rows = unwrap(
		await supabase
			.from("follows")
			.select("followee:users!follows_followee_id_fkey(*)")
			.eq("follower_id", userId),
	);
	return rows.map((row) => toUser(row.followee));
};
