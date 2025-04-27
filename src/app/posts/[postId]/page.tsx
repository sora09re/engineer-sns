import PostDetailPageClient from "@/app/posts/PostDetailPageClient";
import { api } from "@/lib/api-client";
import { getCurrentUserId } from "@/lib/getCurrentUserId";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";

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
