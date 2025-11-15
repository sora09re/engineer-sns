import { FollowsPageClient } from "@/pages/follows";
import type { User } from "@/shared/entities";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";

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
