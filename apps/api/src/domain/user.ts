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
