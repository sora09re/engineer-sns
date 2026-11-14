import type { ProfileType, User, UserValues } from "@engineer-sns/shared";

import { supabase } from "./client";
import { api, parse } from "./http";
import { requireAccountId } from "./session";

/** ログイン中のアカウントのユーザー。新規ユーザー登録前なら null */
export const getCurrentUser = async (): Promise<User | null> => {
	return parse(await api.api.me.$get());
};

/** フォロワー数とフォロー数つきのユーザー。なければ null */
export const getUserProfile = async (userId: string): Promise<ProfileType | null> => {
	const response = await api.api.users[":userId"].$get({ param: { userId } });
	if (response.status === 404) {
		return null;
	}
	return parse(response);
};

/** 名前・ユーザーネーム・自己紹介のどれかにキーワードを含むユーザー。ユーザーネーム順 */
export const searchUsers = async (keyword: string): Promise<User[]> => {
	return parse(await api.api.users.search.$get({ query: { q: keyword } }));
};

/** 新規ユーザー登録: ログイン中のアカウントにユーザーを作る */
export const createCurrentUser = async (values: UserValues): Promise<User> => {
	return parse(await api.api.me.$post({ json: values }));
};

/** ログイン中のアカウントのユーザーを編集する。渡した項目だけを変える */
export const updateCurrentUser = async (values: Partial<UserValues>): Promise<User> => {
	return parse(await api.api.me.$patch({ json: values }));
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
