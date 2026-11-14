import { Button, Center } from "@mantine/core";

import { FollowButton } from "@/components/FollowButton/FollowButton";

interface ProfileActionsButtonProps {
	currentUserId: string;
	userId: string;
	onEditProfile: () => void;
}

export const ProfileActionsButton = ({
	currentUserId,
	userId,
	onEditProfile,
}: ProfileActionsButtonProps) => {
	const isCurrentUser = currentUserId === userId;

	return (
		<Center>
			{isCurrentUser ? (
				<Button variant="outline" color="dark" onClick={onEditProfile}>
					プロフィールを編集
				</Button>
			) : (
				<FollowButton userId={userId} />
			)}
		</Center>
	);
};
