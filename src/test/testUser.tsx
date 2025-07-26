import type { User } from "@/shared/entities";

export const testUser1: User = {
	id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
	bio: "This is user 1's bio.",
	created_at: new Date().toISOString(),
	email: "user1@example.com",
	location: "Tokyo, Japan",
	name: "User One",
	profile_image_url: "https://example.com/user1.jpg",
	updated_at: new Date().toISOString(),
	username: "user_one",
	website: "https://user1-website.com",
};

export const testUser2: User = {
	id: "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1",
	bio: "This is user 2's bio.",
	created_at: new Date().toISOString(),
	email: "user2@example.com",
	location: "Osaka, Japan",
	name: "User Two",
	profile_image_url: "https://example.com/user2.jpg",
	updated_at: new Date().toISOString(),
	username: "user_two",
	website: "https://user2-website.com",
};

export const testUser3: User = {
	id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
	bio: "This is user 3's bio.",
	created_at: new Date().toISOString(),
	email: "user3@example.com",
	location: "Kyoto, Japan",
	name: "User Three",
	profile_image_url: "https://example.com/user3.jpg",
	updated_at: new Date().toISOString(),
	username: "user_three",
	website: "https://user3-website.com",
};
