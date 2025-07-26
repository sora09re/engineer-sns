"use client";

import { NewPostForm } from "@/shared/components/NewPostForm/NewPostForm";
import { PostsList } from "@/shared/components/PostsList/PostsList";
import { Sidebar } from "@/shared/components/Sidebar/Sidebar";
import type { PostType } from "@/shared/types/post";
import type { User } from "@/shared/types/user";
import { sideBarWidthBase } from "@/shared/utils/sideBarWidth";
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
