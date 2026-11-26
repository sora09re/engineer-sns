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

export { findUserValuesError } from "@engineer-sns/shared/rules";
