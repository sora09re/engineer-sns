"use client";

import { Follows } from "@/components/Follows/Follows";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";
import { Box, Flex } from "@mantine/core";

interface FollowsPageClientProps {
	currentUser: User;
	userId: string;
}

export default function FollowsPageClient({
	currentUser,
	userId,
}: FollowsPageClientProps) {
	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<Follows currentUserId={currentUser.id} userId={userId} />
			</Box>
		</Flex>
	);
}
