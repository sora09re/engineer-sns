import { ProfilePageClient } from "@/pages/profile";
import type { PostType, ProfileType, User } from "@/shared/entities";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";

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
