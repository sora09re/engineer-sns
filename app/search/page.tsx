import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";
import type { User } from "@/shared/types/user";
import SearchPageClient from "./_components/SearchPageClient";

export default async function SearchPage() {
	const currentUserId = await getCurrentUserId();

	const currentUser = await api.get<User>("/api/users/current", {
		params: { currentUserId },
	});

	return <SearchPageClient currentUser={currentUser} />;
}
