import { findProfileImageError, profileImageExtension } from "../domain/profile-image";
import { ValidationError } from "./errors";
import type { ProfileImageStorage } from "./ports";

export const issueProfileImageUpload = (deps: { storage: ProfileImageStorage }) => {
	return async (input: { accountId: string; contentType: string; size: number }) => {
		const error = findProfileImageError(input);
		if (error) {
			throw new ValidationError(error);
		}
		const extension = profileImageExtension(input.contentType);
		return deps.storage.createUploadTarget(
			`${input.accountId}/${crypto.randomUUID()}.${extension}`,
		);
	};
};
