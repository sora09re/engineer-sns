"use client";

import type { PostType, User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import {
	CommentForm,
	CommentList,
	Post,
	PreviousPageHeader,
	Sidebar,
} from "@/shared/ui";
import { Box, Flex, Space } from "@mantine/core";
import { useRouter } from "next/navigation";

interface PostDetailPageClientProps {
	currentUser: User;
	post: PostType;
	comments: PostType[];
}

export function PostDetailPageClient({
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
