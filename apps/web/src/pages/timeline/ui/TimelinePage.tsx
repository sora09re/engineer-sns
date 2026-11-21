import { useSuspenseQuery } from "@tanstack/react-query";

import { NewPostForm } from "@/features/create-post";
import { timelinePostsQuery } from "@/entities/post";
import { useCurrentUser } from "@/entities/user";
import { Post } from "@/widgets/post-card";

export const TimelinePage = () => {
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
};
