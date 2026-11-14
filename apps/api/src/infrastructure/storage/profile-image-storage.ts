import type { ProfileImageStorage } from "../../application/ports";

const BUCKET = "profile_image";

export type StorageConfig = {
	/** Supabase のプロジェクトの URL */
	url: string;
	/** Supabase の secret key。署名付きのアップロード URL の発行に使う */
	secretKey: string;
};

/** Supabase Storage の公開バケットに置く。REST を直接呼ぶ */
export const createProfileImageStorage = ({
	url,
	secretKey,
}: StorageConfig): ProfileImageStorage => {
	const storageUrl = `${url}/storage/v1`;
	return {
		createUploadTarget: async (path) => {
			const response = await fetch(`${storageUrl}/object/upload/sign/${BUCKET}/${path}`, {
				method: "POST",
				headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` },
			});
			if (!response.ok) {
				throw new Error(
					`署名付きのアップロード URL を発行できません（${response.status}）: ${await response.text()}`,
				);
			}
			// url は /object/upload/sign/... のように storage/v1 からの相対パスで返る
			const body = (await response.json()) as { url: string };
			return {
				uploadUrl: `${storageUrl}${body.url}`,
				publicUrl: `${storageUrl}/object/public/${BUCKET}/${path}`,
			};
		},
	};
};
