import { Space } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { commentsQuery, postQuery } from "@/api/queries";
import { CommentForm } from "@/components/CommentForm/CommentForm";
import { PostsList } from "@/components/PostsList/PostsList";
import { Post } from "@/components/Post/Post";
import { PreviousPageHeader } from "@/components/PreviousPageHeader/PreviousPageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { pageTitle } from "@/lib/title";

export const Route = createFileRoute("/_authed/posts/$postId")({
	head: () => pageTitle("投稿"),
	loader: async ({ context, params }) => {
		const [post] = await Promise.all([
			context.queryClient.ensureQueryData(postQuery(params.postId)),
			context.queryClient.ensureQueryData(commentsQuery(params.postId)),
		]);
		if (!post) {
			throw notFound();
		}
	},
	component: PostDetailPage,
});

function PostDetailPage() {
	const { postId } = Route.useParams();
	const currentUser = useCurrentUser();
	const { data: post } = useSuspenseQuery(postQuery(postId));
	const { data: comments } = useSuspenseQuery(commentsQuery(postId));

	return (
		<>
			<PreviousPageHeader />
			{/* 削除された直後は null になる */}
			{post && <Post post={post} currentUserId={currentUser.id} />}
			<Space h="md" />
			<CommentForm postId={postId} />
			<PostsList posts={comments} currentUserId={currentUser.id} />
		</>
	);
}
