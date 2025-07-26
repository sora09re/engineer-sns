"use client";

import type { PostType, ProfileType, User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { EditProfileModal, PostsList, Profile, Sidebar } from "@/shared/ui";
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
