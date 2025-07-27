"use client";

import { Box } from "@mantine/core";

import type { ProfileType } from "@/shared/entities";
import { CenteredLoader } from "@/shared/ui";

import { ProfileActionsButton } from "./ProfileActionsButton";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

interface ProfileProps {
	currentUserId: string;
	user: ProfileType | undefined;
}

export const Profile = ({ currentUserId, user }: ProfileProps) => {
	if (!user) {
		return <CenteredLoader />;
	}

	return (
		<Box
			p="xl"
			w="100%"
			sx={{
				borderBottom: "1px solid #E9ECEF",
			}}
		>
			<ProfileHeader user={user} />
			<ProfileStats user={user} />
			<ProfileActionsButton currentUserId={currentUserId} userId={user.id} />
		</Box>
	);
};
