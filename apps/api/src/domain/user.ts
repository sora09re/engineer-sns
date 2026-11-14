/** ユーザー: アカウントに紐づき、プロフィールを持つ SNS 上の人格。ID はアカウントの ID と同じ */
export type User = {
	id: string;
	name: string;
	username: string;
	email: string;
	bio?: string;
	location?: string;
	website?: string;
	profileImageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
};

/** ユーザーが編集できる項目 */
export type UserValues = Pick<
	User,
	"name" | "username" | "email" | "bio" | "location" | "website" | "profileImageUrl"
>;

export const BIO_MAX_LENGTH = 160;

const requiredFields = [
	["name", "名前"],
	["username", "ユーザーネーム"],
	["email", "メールアドレス"],
] as const;

/**
 * 項目のルールに合わなければ、利用者に見せるメッセージを返す。合っていれば null。
 * 渡された項目だけを確かめる（編集では変える項目だけが渡される）
 */
export const findUserValuesError = (values: Partial<UserValues>): string | null => {
	for (const [field, label] of requiredFields) {
		const value = values[field];
		if (value !== undefined && !value.trim()) {
			return `${label}を入力してください。`;
		}
	}
	if (values.bio !== undefined && values.bio.length > BIO_MAX_LENGTH) {
		return `自己紹介は${BIO_MAX_LENGTH}文字以内で入力してください。`;
	}
	return null;
};
