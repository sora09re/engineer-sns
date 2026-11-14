import { supabase, throwIfError } from "./client";
import { requireAccountId } from "./session";

export const likePost = async (postId: string) => {
	const accountId = await requireAccountId();
	throwIfError(await supabase.from("likes").insert({ post_id: postId, user_id: accountId }));
};

export const unlikePost = async (postId: string) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", accountId),
	);
};
