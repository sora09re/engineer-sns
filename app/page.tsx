import { TopPageClient } from "@/pages/top";
import type { PostType, User } from "@/shared/entities";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";

export default async function TopPage() {
	const currentUserId = await getCurrentUserId();

	const [currentUser, timelinePosts] = await Promise.all([
		api.get<User>("/api/users/current", {
			params: { currentUserId },
		}),
		api.get<PostType[]>("/api/posts", {
			params: { currentUserId },
		}),
	]);

	return (
		<TopPageClient currentUser={currentUser} timelinePosts={timelinePosts} />
	);
}
