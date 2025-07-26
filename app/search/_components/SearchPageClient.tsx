"use client";

import { Search } from "@/components/Search/Search";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { User } from "@/shared/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";
import { Box, Flex } from "@mantine/core";

interface SearchPageClientProps {
	currentUser: User;
}

export default function SearchPageClient({
	currentUser,
}: SearchPageClientProps) {
	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<Search currentUser={currentUser} />
			</Box>
		</Flex>
	);
}
