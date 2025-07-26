import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { useSession } from "next-auth/react";

import type { User } from "@/shared/entities";

interface AccountButtonProps {
	currentUser: Pick<User, "name" | "username" | "profile_image_url">;
}

export const AccountButton = ({ currentUser }: AccountButtonProps) => {
	const { data: session } = useSession();

	if (session) {
		return (
			<UnstyledButton>
				<Group>
					<Avatar src={currentUser.profile_image_url} size={40} />
					<div>
						<Text>{currentUser.name}</Text>
						<Text size="xs" color="dimmed">
							@{currentUser.username}
						</Text>
					</div>
				</Group>
			</UnstyledButton>
		);
	}

	return <></>;
};
