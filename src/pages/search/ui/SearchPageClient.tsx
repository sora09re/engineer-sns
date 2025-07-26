"use client";

import type { User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { Search, Sidebar } from "@/shared/ui";
import { Box, Flex } from "@mantine/core";

interface SearchPageClientProps {
	currentUser: User;
}

export function SearchPageClient({ currentUser }: SearchPageClientProps) {
	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<Search currentUser={currentUser} />
			</Box>
		</Flex>
	);
}
