import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { PostType } from "@/types/post";
import type { ProfileType } from "@/types/profile";
import type { User } from "@/types/user";
import ProfilePageClient from "./_components/ProfilePageClient";

interface ProfilePageProps {
	params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const currentUserId = await getCurrentUserId();
	const { userId } = await params;

	const [currentUser, user, postsForUser] = await Promise.all([
		api.get<User>("/api/users/current", {
			params: { currentUserId },
		}),
		api.get<ProfileType>(`/api/profile/${userId}`),
		api.get<PostType[]>(`/api/profile/posts/${userId}`),
	]);

	return (
		<ProfilePageClient
			currentUser={currentUser}
			user={user}
			postsForUser={postsForUser}
		/>
	);
}
