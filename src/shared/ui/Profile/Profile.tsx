import { Box } from "@mantine/core";

import type { ProfileType } from "@/shared/entities";
import { CenteredLoader } from "@/shared/ui/CenteredLoader/CenteredLoader";
import { ProfileActionsButton } from "@/shared/ui/ProfileActionsButton/ProfileActionsButton";
import { ProfileHeader } from "@/shared/ui/ProfileHeader/ProfileHeader";
import { ProfileStats } from "@/shared/ui/ProfileStats/ProfileStats";

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
