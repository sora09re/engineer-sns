import { Avatar, Center, Flex, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";

import type { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <>
      <Center>
        <Avatar
          src={user.profile_image_url}
          alt="プロフィール画像"
          size={150}
          mb="md"
        />
      </Center>
      <Text size="xl" fw="bold" align="center">
        {user.name}
      </Text>
      <Text color="dimmed" align="center">
        @{user.username}
      </Text>
      {user.bio && <Text align="center">{user.bio}</Text>}
      {user.website && (
        <Flex justify="center" align="center">
          <IconLink />
          <a href={user.website} style={{ color: "#197ABC" }}>
            {user.website}
          </a>
        </Flex>
      )}
    </>
  );
};
