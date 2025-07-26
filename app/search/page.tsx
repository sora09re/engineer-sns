import { SearchPageClient } from "@/pages/search";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";
import type { User } from "@/shared/types/user";

export default async function SearchPage() {
	const currentUserId = await getCurrentUserId();

	const currentUser = await api.get<User>("/api/users/current", {
		params: { currentUserId },
	});

	return <SearchPageClient currentUser={currentUser} />;
}
