"use client";

import type { PostType, ProfileType, User } from "@/shared/types";
import { EditProfileModal, PostsList, Profile, Sidebar } from "@/shared/ui";
import { sideBarWidthBase } from "@/shared/utils";
import { Box, Flex } from "@mantine/core";

interface ProfilePageClientProps {
	currentUser: User;
	user: ProfileType;
	postsForUser: PostType[];
}

export function ProfilePageClient({
	currentUser,
	user,
	postsForUser,
}: ProfilePageClientProps) {
	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<Profile user={user} currentUserId={currentUser.id} />
				<PostsList posts={postsForUser} currentUserId={currentUser.id} />
			</Box>
			<EditProfileModal currentUser={currentUser} />
		</Flex>
	);
}
