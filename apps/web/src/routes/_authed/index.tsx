import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { timelinePostsQuery } from "@/api/queries";
import { Post } from "@/components/Post/Post";
import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { pageTitle } from "@/lib/title";

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
