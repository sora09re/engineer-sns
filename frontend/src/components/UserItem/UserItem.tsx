import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Paper,
  Space,
  Text,
} from "@mantine/core";
// import Link from "next/link";
import { useState } from "react";

import type { User } from "@/types/user";

type UserItemProps = {
  propsUser: User;
};

export const UserItem = ({ propsUser }: UserItemProps) => {
  const [label, setLabel] = useState("フォロー中");

  return (
    // <Link href="">
    <Paper p="md" w="100%" style={{ marginBottom: 20 }}>
      <Flex>
        <Avatar
          src={propsUser.profileImageUrl}
          size={50}
          style={{ marginBottom: 10 }}
        />
        <Space w={10} />
        <Box w="100%">
          <Flex justify="space-between">
            <Box>
              <Text>{propsUser.name}</Text>
              <Text color="dimmed">
                {propsUser.username} <Badge color="gray">フォローされています</Badge>
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
    </Paper>
    // </Link>
  );
};
