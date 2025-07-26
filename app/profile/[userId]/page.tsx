import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { PostType } from "@/shared/types/post";
import type { ProfileType } from "@/shared/types/profile";
import type { User } from "@/shared/types/user";
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
