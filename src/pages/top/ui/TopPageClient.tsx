"use client";

import type { PostType, User } from "@/shared/entities";
import { NewPostForm, PostsList, Sidebar } from "@/shared/ui";
import { sideBarWidthBase } from "@/shared/utils";
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
