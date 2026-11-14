import type { ProfileType, User, UserValues } from "@engineer-sns/shared";

import { api, parse } from "./http";

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

/** ファイルを選ぶときの候補。受け付けるかどうかは API が決める */
export const PROFILE_IMAGE_MIME_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

/** プロフィール画像をアップロードし、公開 URL を返す。アップロード先は API が発行する */
export const uploadProfileImage = async (file: File): Promise<string> => {
	const target = await parse(
		await api.api.me["profile-image"].$post({
			json: { content_type: file.type, size: file.size },
		}),
	);
	const response = await fetch(target.upload_url, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	});
	if (!response.ok) {
		throw new Error(`画像をアップロードできませんでした（${response.status}）。`);
	}
	return target.public_url;
};
