"use client";

import type { User } from "@/shared/entities";
import { Follows, Sidebar } from "@/shared/ui";
import { sideBarWidthBase } from "@/shared/utils";
import { Box, Flex } from "@mantine/core";

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
