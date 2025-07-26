import { FollowsPageClient } from "@/pages/follows";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";
import type { User } from "@/shared/types/user";

interface FollowsPageProps {
	params: Promise<{ userId: string }>;
}

export default async function FollowsPage({ params }: FollowsPageProps) {
	const currentUserId = await getCurrentUserId();

	const currentUser = await api.get<User>("/api/users/current", {
		params: { currentUserId },
	});

	const { userId } = await params;

	return <FollowsPageClient currentUser={currentUser} userId={userId} />;
}
