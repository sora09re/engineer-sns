"use client";

import type { PostType, User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { NewPostForm, Sidebar } from "@/shared/ui";
import { PostsList } from "@/widgets/posts-list";
import { Box, Flex } from "@mantine/core";

interface TopPageClientProps {
	currentUser: User;
	timelinePosts: PostType[];
}

export function TopPageClient({
	currentUser,
	timelinePosts,
}: TopPageClientProps) {
	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<NewPostForm currentUser={currentUser} />
				<PostsList posts={timelinePosts} currentUserId={currentUser.id} />
			</Box>
		</Flex>
	);
}
