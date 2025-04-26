import TopPageClient from "@/app/TopPageClient";
import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";

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
