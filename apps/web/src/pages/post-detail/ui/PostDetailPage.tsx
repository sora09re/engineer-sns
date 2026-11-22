import { Space } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { commentsQuery, postQuery } from "@/entities/post";
import { NotFoundView, PreviousPageHeader } from "@/shared/ui";
import { Post } from "@/widgets/post-card";

import { CommentForm } from "./CommentForm";

interface PostDetailPageProps {
	postId: string;
}

export const PostDetailPage = ({ postId }: PostDetailPageProps) => {
	const { data: post } = useSuspenseQuery(postQuery(postId));
	const { data: comments } = useSuspenseQuery(commentsQuery(postId));
	const router = useRouter();

	if (!post) {
		return <NotFoundView />;
	}

	const leave = () => {
		if (router.history.canGoBack()) {
			router.history.back();
		} else {
			void router.navigate({ to: "/" });
		}
	};

	return (
		<>
			<PreviousPageHeader />
			<Post post={post} onDeleted={leave} />
			<Space h="md" />
			<CommentForm postId={postId} />
			{comments.map((comment) => {
				return <Post key={comment.id} post={comment} />;
			})}
		</>
	);
};
