import { findProfileImageError, profileImageExtension } from "../domain/profile-image";
import { ValidationError } from "./errors";
import type { ProfileImageStorage } from "./ports";

/**
 * プロフィール画像のアップロード先を発行する。置き場所はアカウントのフォルダの下で、毎回新しい名前にする。
 * 新規ユーザー登録のフォームでも使うので、ユーザーがなくてもよい
 */
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

export type IssueProfileImageUpload = ReturnType<typeof issueProfileImageUpload>;
