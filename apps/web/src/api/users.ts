import type { ProfileType, User, UserValues } from "@engineer-sns/shared";

import { countOf, ilikePattern, supabase, throwIfError, unwrap, unwrapMaybe } from "./client";
import type { Tables } from "./database.types";
import { requireAccountId } from "./session";

export const toUser = (row: Tables<"users">): User => {
	return {
		id: row.id,
		bio: row.bio ?? undefined,
		created_at: row.created_at,
		email: row.email,
		location: row.location ?? undefined,
		name: row.name,
		profile_image_url: row.profile_image_url ?? undefined,
		updated_at: row.updated_at,
		username: row.username,
		website: row.website ?? undefined,
	};
};

const toRow = (values: Partial<UserValues>) => {
	return {
		bio: values.bio,
		email: values.email,
		location: values.location,
		name: values.name,
		profile_image_url: values.profile_image_url,
		username: values.username,
		website: values.website,
	};
};

/** ログイン中のアカウントのユーザー。新規ユーザー登録前なら null */
export const getCurrentUser = async (): Promise<User | null> => {
	const accountId = await requireAccountId();
	const row = unwrapMaybe(
		await supabase.from("users").select("*").eq("id", accountId).maybeSingle(),
	);
	return row ? toUser(row) : null;
};

export const getUserProfile = async (userId: string): Promise<ProfileType | null> => {
	const row = unwrapMaybe(
		await supabase
			.from("users")
			.select(
				"*, followers:follows!follows_followee_id_fkey(count), followees:follows!follows_follower_id_fkey(count)",
			)
			.eq("id", userId)
			.maybeSingle(),
	);

	if (!row) {
		return null;
	}

	return {
		...toUser(row),
		follower_count: countOf(row.followers),
		followee_count: countOf(row.followees),
	};
};

export const searchUsers = async (keyword: string): Promise<User[]> => {
	if (!keyword.trim()) {
		return [];
	}
	const pattern = ilikePattern(keyword);
	const rows = unwrap(
		await supabase
			.from("users")
			.select("*")
			.or(`name.ilike.${pattern},username.ilike.${pattern},bio.ilike.${pattern}`),
	);
	return rows.map(toUser);
};

/** 新規ユーザー登録: ログイン中のアカウントにユーザーを作る */
export const createCurrentUser = async (values: UserValues) => {
	const accountId = await requireAccountId();
	throwIfError(
		await supabase.from("users").insert({
			...toRow(values),
			id: accountId,
			email: values.email,
			name: values.name,
			username: values.username,
		}),
	);
};

export const updateCurrentUser = async (values: Partial<UserValues>) => {
	const accountId = await requireAccountId();
	throwIfError(await supabase.from("users").update(toRow(values)).eq("id", accountId));
};

const IMAGE_EXTENSIONS: Record<string, string> = {
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

export const PROFILE_IMAGE_MIME_TYPES = Object.keys(IMAGE_EXTENSIONS);

/** プロフィール画像をアップロードし、公開 URL を返す */
export const uploadProfileImage = async (file: File): Promise<string> => {
	const accountId = await requireAccountId();
	const extension = IMAGE_EXTENSIONS[file.type];
	if (!extension) {
		throw new Error(`対応していない画像形式です: ${file.type}`);
	}
	const path = `${accountId}/${Date.now()}.${extension}`;

	const bucket = supabase.storage.from("profile_image");
	const { error } = await bucket.upload(path, file, { contentType: file.type });
	if (error) {
		throw error;
	}
	return bucket.getPublicUrl(path).data.publicUrl;
};
