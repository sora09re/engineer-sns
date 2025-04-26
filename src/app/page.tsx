import TopPageClient from "@/app/TopPageClient";
import { api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { redirect } from "next/navigation";

export default async function TopPage() {
	const session = await auth();

	const currentUserId = session?.user.id;

	if (!currentUserId) {
		redirect("/auth/signin");
	}

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
