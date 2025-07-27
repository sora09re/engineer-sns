"use client";

import type { User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { Sidebar } from "@/shared/ui";
import { Box, Flex } from "@mantine/core";

import { Follows } from "./Follows";

interface FollowsPageClientProps {
	currentUser: User;
	userId: string;
}

export function FollowsPageClient({
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
