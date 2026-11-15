import type { UserValues } from "@engineer-sns/shared";

import { api, parse } from "@/shared/api";

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

/** プロフィール画像があればアップロードしてから値に反映する */
export const withUploadedImage = async (values: UserValues, imageFile: File | null) => {
	if (!imageFile) {
		return values;
	}
	return { ...values, profile_image_url: await uploadProfileImage(imageFile) };
};
