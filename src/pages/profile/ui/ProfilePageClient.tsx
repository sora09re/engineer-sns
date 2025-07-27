"use client";

import type { PostType, ProfileType, User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { EditProfileModal, Sidebar } from "@/shared/ui";
import { PostsList } from "@/widgets/posts-list";
import { Box, Flex } from "@mantine/core";

import { Profile } from "./Profile";

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
