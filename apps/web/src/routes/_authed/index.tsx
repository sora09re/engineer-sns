import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { timelinePostsQuery } from "@/entities/post";
import { useCurrentUser } from "@/entities/user";
import { Post } from "@/widgets/post-card";
import { NewPostForm } from "@/features/create-post";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/")({
	head: () => pageTitle("ホーム"),
	loader: ({ context }) => context.queryClient.ensureQueryData(timelinePostsQuery()),
	component: TimelinePage,
});

function TimelinePage() {
	const currentUser = useCurrentUser();
	const { data: posts } = useSuspenseQuery(timelinePostsQuery());

	return (
		<>
			<NewPostForm />
			{posts.map((post) => {
				return <Post key={post.id} post={post} currentUserId={currentUser.id} />;
			})}
		</>
	);
}
