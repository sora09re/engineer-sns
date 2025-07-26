import { PostDetailPageClient } from "@/pages/posts";
import type { PostType, User } from "@/shared/entities";
import { api } from "@/shared/lib/api-client";
import { getCurrentUserId } from "@/shared/lib/getCurrentUserId";

interface PostDetailPageProps {
	params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const currentUserId = await getCurrentUserId();
	const { postId } = await params;

	const [currentUser, post, comments] = await Promise.all([
		api.get<User>("/api/users/current", {
			params: { currentUserId },
		}),
		api.get<PostType>(`/api/posts/${postId}`),
		api.get<PostType[]>(`/api/posts/${postId}/comments`),
	]);

	return (
		<PostDetailPageClient
			currentUser={currentUser}
			post={post}
			comments={comments}
		/>
	);
}
