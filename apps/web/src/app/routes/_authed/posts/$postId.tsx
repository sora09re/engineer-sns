import { createFileRoute } from "@tanstack/react-router";

import { commentsQuery, postDetail } from "@/entities/post";
import { PostDetailPage } from "@/pages/post-detail";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/posts/$postId")({
	head: () => pageTitle("投稿"),
	loader: async ({ context, params }) => {
		await Promise.all([
			postDetail.load(context.queryClient, params.postId),
			context.queryClient.ensureQueryData(commentsQuery(params.postId)),
		]);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { postId } = Route.useParams();
	return <PostDetailPage postId={postId} />;
}
