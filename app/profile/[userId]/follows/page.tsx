import FollowsPageClient from "@/app/profile/[userId]/follows/_components/FollowsPageClient";
import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { User } from "@/types/user";

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
