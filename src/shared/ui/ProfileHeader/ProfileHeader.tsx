import { Avatar, Center, Flex, Space, Text } from "@mantine/core";
import { IconLink, IconMapPinPin } from "@tabler/icons-react";

import type { ProfileType } from "@/shared/entities";

interface ProfileHeaderProps {
	user: ProfileType;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
	return (
		<>
			<Center>
				<Avatar
					src={user.profile_image_url}
					alt="プロフィール画像"
					size={120}
				/>
			</Center>
			<Text size="xl" fw="bold" align="center" mt="md">
				{user.name}
			</Text>
			<Text color="dimmed" align="center">
				@{user.username}
			</Text>
			{user.bio && (
				<Text align="center" mt="md">
					{user.bio}
				</Text>
			)}
			{user.location && (
				<Flex justify="center" align="center" mt="sm">
					<IconMapPinPin size="1.2rem" />
					<Space w={10} />
					<Text color="dimmed" align="center">
						{user.location}
					</Text>
				</Flex>
			)}
			{user.website && (
				<Flex justify="center" align="center" mt="sm">
					<IconLink size="1.2rem" />
					<Space w={10} />
					<a href={user.website} style={{ color: "#197ABC" }}>
						{user.website}
					</a>
				</Flex>
			)}
		</>
	);
};
