export const PROFILE_IMAGE_MIME_TYPES = [
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
] as const;

export type ProfileImageMimeType = (typeof PROFILE_IMAGE_MIME_TYPES)[number];

export const PROFILE_IMAGE_MAX_SIZE = 3 * 1024 * 1024;

export const isProfileImageMimeType = (
	contentType: string,
): contentType is ProfileImageMimeType => {
	return (PROFILE_IMAGE_MIME_TYPES as readonly string[]).includes(contentType);
};

export const findProfileImageError = (image: { contentType: string; size: number }) => {
	if (!isProfileImageMimeType(image.contentType)) {
		return "対応していない画像形式です。";
	}
	if (image.size > PROFILE_IMAGE_MAX_SIZE) {
		return `画像は${PROFILE_IMAGE_MAX_SIZE / 1024 / 1024}MBまでです。`;
	}
	return null;
};
