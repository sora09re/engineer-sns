"use client";

import { CommentForm } from "@/components/CommentForm/CommentForm";
import { CommentList } from "@/components/CommentList/CommentList";
import { Post } from "@/components/Post/Post";
import { PreviousPageHeader } from "@/components/PreviousPageHeader/PreviousPageHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";
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
