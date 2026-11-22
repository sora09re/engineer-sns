import type { UserValues } from "@engineer-sns/shared";

import { api, parse } from "@/shared/api";

export type UserValuesSubmission = {
	imageFile: File | null;
	values: UserValues;
};

const uploadProfileImage = async (file: File): Promise<string> => {
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

export const toUserValuesBody = async ({
	imageFile,
	values,
}: UserValuesSubmission): Promise<UserValues> => {
	if (!imageFile) {
		return values;
	}
	return { ...values, profile_image_url: await uploadProfileImage(imageFile) };
};
