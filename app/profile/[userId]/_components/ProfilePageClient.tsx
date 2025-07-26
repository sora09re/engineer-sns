"use client";

import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { PostType } from "@/shared/types/post";
import type { ProfileType } from "@/shared/types/profile";
import type { User } from "@/shared/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";
import { Box, Flex } from "@mantine/core";

interface ProfilePageClientProps {
	currentUser: User;
	user: ProfileType;
	postsForUser: PostType[];
}

export default function ProfilePageClient({
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
