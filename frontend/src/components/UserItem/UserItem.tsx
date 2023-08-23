import { Avatar, Badge, Box, Button, Flex, Space, Text } from "@mantine/core";
import Link from "next/link";
// import Link from "next/link";
import { useState } from "react";

import type { User } from "@/types/user";

type UserItemProps = {
  propsUser: User;
};

export const UserItem = ({ propsUser }: UserItemProps) => {
  const [label, setLabel] = useState("フォロー中");

  return (
    <Box
      p="md"
      w="100%"
      sx={{ borderBottom: "1px solid #E9ECEF", cursor: "pointer" }}
    >
      <Flex>
        <Link href={`/profile/${propsUser.id}`}>
          <Avatar src={propsUser.profile_image_url} alt="プロフィール画像" />
        </Link>
        <Space w="1rem" />
        <Box w="100%">
          <Flex justify="space-between">
            <Box>
              <Text fw={700} color="black">
                {propsUser.name}
              </Text>
              <Text color="dimmed">
                @{propsUser.username}{" "}
                <Badge color="gray">フォローされています</Badge>
              </Text>
            </Box>
            <Button
              onMouseEnter={() => {
                return setLabel("フォロー解除");
              }}
              onMouseLeave={() => {
                return setLabel("フォロー中");
              }}
              variant="outline"
              styles={(theme) => {
                return {
                  root: {
                    "&:not([data-disabled])": theme.fn.hover({
                      backgroundColor: "white",
                      borderColor: "red",
                      color: "red",
                    }),
                  },
                };
              }}
            >
              {label}
            </Button>
          </Flex>
          <Text variant="h5">{propsUser.bio}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
