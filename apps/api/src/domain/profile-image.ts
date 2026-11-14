/** プロフィール画像として受け付ける画像形式と、保存するときの拡張子 */
const EXTENSIONS: Record<string, string> = {
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

export const PROFILE_IMAGE_MAX_SIZE = 3 * 1024 * 1024;

/** 画像形式の拡張子。受け付けない形式なら null */
export const profileImageExtension = (contentType: string): string | null => {
	return EXTENSIONS[contentType] ?? null;
};

/** ルールに合わなければ、利用者に見せるメッセージを返す。合っていれば null */
export const findProfileImageError = (image: { contentType: string; size: number }) => {
	if (!profileImageExtension(image.contentType)) {
		return "対応していない画像形式です。";
	}
	if (image.size > PROFILE_IMAGE_MAX_SIZE) {
		return "画像は3MBまでです。";
	}
	return null;
};
