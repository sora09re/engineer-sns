import { isProfileImageMimeType, type ProfileImageMimeType } from "@engineer-sns/shared/rules";

export { findProfileImageError } from "@engineer-sns/shared/rules";

const EXTENSIONS: Record<ProfileImageMimeType, string> = {
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

export const profileImageExtension = (contentType: string): string | null => {
	return isProfileImageMimeType(contentType) ? EXTENSIONS[contentType] : null;
};
