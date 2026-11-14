import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";

import type { User } from "@/types/user";

interface AccountButtonProps {
	currentUser: Pick<User, "name" | "username" | "profile_image_url">;
}

export const AccountButton = ({ currentUser }: AccountButtonProps) => {
	return (
		<UnstyledButton>
			<Group>
				<Avatar src={currentUser.profile_image_url} size={40} />
				<div>
					<Text>{currentUser.name}</Text>
					<Text size="xs" c="dimmed">
						@{currentUser.username}
					</Text>
				</div>
			</Group>
		</UnstyledButton>
	);
};
