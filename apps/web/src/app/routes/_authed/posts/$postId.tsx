import { createFileRoute, notFound } from "@tanstack/react-router";

import { commentsQuery, postQuery } from "@/entities/post";
import { PostDetailPage } from "@/pages/post-detail";
import { pageTitle } from "@/shared/lib";

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
	component: RouteComponent,
});

function RouteComponent() {
	const { postId } = Route.useParams();
	return <PostDetailPage postId={postId} />;
}
