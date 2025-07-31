"use client";

import type { ProfileType } from "@/entities/profile";
import type { PostType, User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { PostsList } from "@/widgets/posts";
import { Sidebar } from "@/widgets/sidebar";
import { Box, Flex } from "@mantine/core";
import { EditProfileModal } from "./EditProfileModal";

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
