"use client";

import { Search, Sidebar } from "@/shared/components";
import type { User } from "@/shared/types";
import { sideBarWidthBase } from "@/shared/utils";
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
