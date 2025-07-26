import { Post } from "@/shared/components/Post/Post";
import type { PostType } from "@/shared/entities";

interface PostsListProps {
	currentUserId: string;
	keyword?: string;
	posts: PostType[] | undefined;
}

export const PostsList = ({
	currentUserId,
	keyword,
	posts,
}: PostsListProps) => {
	if (!posts) {
		return <></>;
	}

	return (
		<>
			{posts.map((post) => {
				return (
					<Post
						key={post.id}
						post={post}
						currentUserId={currentUserId}
						keyword={keyword}
					/>
				);
			})}
		</>
	);
};
