import { Avatar, Box, Flex, Space, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import { FollowButton } from "@/components/FollowButton/FollowButton";
import type { User } from "@/types/user";

type UserItemProps = {
  currentUserId: string;
  propsUser: User;
};

export const UserItem = ({ currentUserId, propsUser }: UserItemProps) => {
  const router = useRouter();
  const isCurrentUser = currentUserId === propsUser.id;

  return (
    <Box
      p="md"
      w="100%"
      sx={{ borderBottom: "1px solid #E9ECEF", cursor: "pointer" }}
      onClick={() => {
        return router.push(`/profile/${propsUser.id}`);
      }}
    >
      <Flex>
        <Link href={`/profile/${propsUser.id}`}>
          <Avatar src={propsUser.profile_image_url} alt="プロフィール画像" />
        </Link>
        <Space w="1rem" />
        <Box w="100%">
          <Flex justify="space-between">
            <Box>
              <Link
                href={`/profile/${propsUser.id}`}
                style={{ textDecoration: "none" }}
              >
                <Text fw={700} color="black">
                  {propsUser.name}
                </Text>
              </Link>
              <Text color="dimmed">
                @{propsUser.username}
                {/* {" "}
                <Badge color="gray">フォローされています</Badge> */}
              </Text>
            </Box>
            {isCurrentUser ? (
              <></>
            ) : (
              <FollowButton
                userId={propsUser.id}
                currentUserId={currentUserId}
              />
            )}
          </Flex>
          <Text variant="h5">{propsUser.bio}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
