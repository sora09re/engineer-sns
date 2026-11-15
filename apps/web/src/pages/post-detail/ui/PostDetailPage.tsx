import { Space } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

import { commentsQuery, postQuery } from "@/entities/post";
import { useCurrentUser } from "@/entities/user";
import { PreviousPageHeader } from "@/shared/ui";
import { Post } from "@/widgets/post-card";

import { CommentForm } from "./CommentForm";

interface PostDetailPageProps {
	postId: string;
}

export const PostDetailPage = ({ postId }: PostDetailPageProps) => {
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
			{comments.map((comment) => {
				return <Post key={comment.id} post={comment} currentUserId={currentUser.id} />;
			})}
		</>
	);
};
