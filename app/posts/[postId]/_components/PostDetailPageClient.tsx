"use client";

import { CommentForm } from "@/shared/components/CommentForm/CommentForm";
import { CommentList } from "@/shared/components/CommentList/CommentList";
import { Post } from "@/shared/components/Post/Post";
import { PreviousPageHeader } from "@/shared/components/PreviousPageHeader/PreviousPageHeader";
import { Sidebar } from "@/shared/components/Sidebar/Sidebar";
import type { PostType } from "@/shared/types/post";
import type { User } from "@/shared/types/user";
import { sideBarWidthBase } from "@/shared/utils/sideBarWidth";
import { Box, Flex, Space } from "@mantine/core";
import { useRouter } from "next/navigation";

interface PostDetailPageClientProps {
	currentUser: User;
	post: PostType;
	comments: PostType[];
}

export default function PostDetailPageClient({
	currentUser,
	post,
	comments,
}: PostDetailPageClientProps) {
	const router = useRouter();

	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box ml={sideBarWidthBase} w="100%">
				<PreviousPageHeader router={router} />
				<Post post={post} currentUserId={currentUser.id} />
				<Space h="md" />
				<CommentForm currentUser={currentUser} postId={post.id} />
				<CommentList currentUser={currentUser} comments={comments || []} />
			</Box>
		</Flex>
	);
}
