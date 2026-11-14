import type { PostType } from "@engineer-sns/shared";

import { countOf, supabase, throwIfError, unwrap, unwrapMaybe } from "./client";
import { api, parse } from "./http";
import { requireAccountId } from "./session";
import { toUser } from "./users";

const POST_SELECT = "*, users(*), likes(*), comments:posts!parent_post_id(count)" as const;

const selectPosts = () => {
	return supabase.from("posts").select(POST_SELECT);
};

type PostRow = NonNullable<Awaited<ReturnType<typeof selectPosts>>["data"]>[number];

const toPost = (row: PostRow): PostType => {
	return {
		id: row.id,
		comment_count: countOf(row.comments),
		content: row.content,
		created_at: row.created_at,
		likes: row.likes.map((like) => {
			return { id: like.id, post_id: like.post_id, user_id: like.user_id };
		}),
		parent_post_id: row.parent_post_id,
		user_id: row.user_id,
		users: toUser(row.users),
	};
};

/** タイムライン: 自分とフォローしているユーザーの、コメントでない投稿 */
export const getTimelinePosts = async (): Promise<PostType[]> => {
	return parse(await api.api.posts.timeline.$get());
};

export const getPost = async (postId: string): Promise<PostType | null> => {
	const row = unwrapMaybe(await selectPosts().eq("id", postId).maybeSingle());
	return row ? toPost(row) : null;
};

export const getComments = async (postId: string): Promise<PostType[]> => {
	const rows = unwrap(
		await selectPosts().eq("parent_post_id", postId).order("created_at", { ascending: false }),
	);
	return rows.map(toPost);
};

/** ユーザーが書いた投稿（コメントを含む） */
export const getUserPosts = async (userId: string): Promise<PostType[]> => {
	const rows = unwrap(
		await selectPosts().eq("user_id", userId).order("created_at", { ascending: false }),
	);
	return rows.map(toPost);
};

export const searchPosts = async (keyword: string): Promise<PostType[]> => {
	if (!keyword.trim()) {
		return [];
	}
	const escaped = keyword.replace(/[\\%_]/g, (c) => `\\${c}`);
	const rows = unwrap(
		await selectPosts()
			.is("parent_post_id", null)
			.ilike("content", `%${escaped}%`)
			.order("created_at", { ascending: false }),
	);
	return rows.map(toPost);
};

export const createPost = async (content: string) => {
	const accountId = await requireAccountId();
	throwIfError(await supabase.from("posts").insert({ content, user_id: accountId }));
};

export const createComment = async ({ content, postId }: { content: string; postId: string }) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("posts").insert({ content, parent_post_id: postId, user_id: accountId }),
	);
};

export const deletePost = async (postId: string) => {
	throwIfError(await supabase.from("posts").delete().eq("id", postId));
};
