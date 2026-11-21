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
