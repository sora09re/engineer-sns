import { Box } from "@mantine/core";

import { ProfileActionsButton } from "@/components/ProfileActionsButton/ProfileActionsButton";
import { ProfileHeader } from "@/components/ProfileHeader/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats/ProfileStats";
import type { ProfileType } from "@/types/profile";

interface ProfileProps {
	currentUserId: string;
	user: ProfileType;
}

export const Profile = ({ currentUserId, user }: ProfileProps) => {
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
