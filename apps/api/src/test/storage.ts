import type { StorageConfig } from "../infrastructure/storage/profile-image-storage";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
	throw new Error(
		"SUPABASE_URL と SUPABASE_SECRET_KEY を apps/api/.env.local に設定してください。",
	);
}

/** ローカルの Supabase の Storage */
export const storageConfig: StorageConfig = { url, secretKey };

const PUBLIC_PREFIX = "/storage/v1/object/public/profile_image/";

/** テストでアップロードした画像を消す（Storage は DB のロールバックでは消えない） */
export const deleteUploadedImages = async (publicUrls: string[]) => {
	const names = publicUrls.map((publicUrl) =>
		new URL(publicUrl).pathname.slice(PUBLIC_PREFIX.length),
	);
	await fetch(`${url}/storage/v1/object/profile_image`, {
		method: "DELETE",
		headers: {
			apikey: secretKey,
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ prefixes: names }),
	});
};
