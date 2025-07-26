import SearchPageClient from "@/app/search/_components/SearchPageClient";
import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { User } from "@/types/user";

export default async function SearchPage() {
	const currentUserId = await getCurrentUserId();

	const currentUser = await api.get<User>("/api/users/current", {
		params: { currentUserId },
	});

	return <SearchPageClient currentUser={currentUser} />;
}
