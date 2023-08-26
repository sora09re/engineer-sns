import { Box, Tabs, Text } from "@mantine/core";
import useSWR from "swr";

import { UsersList } from "@/components/UsersList/UsersList";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

interface FollowsProps {
  currentUserId: string;
  userId: string;
}

export const Follows = ({ currentUserId, userId }: FollowsProps) => {
  const { data: followers } = useSWR<User[]>(
    `${baseURL}/api/users/${userId}/followers`,
    fetcher
  );

  const { data: followingUsers } = useSWR<
    User[]
  >(`${baseURL}/api/users/${userId}/following`, fetcher);

  if (!followers || !followingUsers) {
    return <Text>取得に失敗しました。</Text>;
  }

  return (
    <Box p="md">
      <Tabs defaultValue="followers" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="followers">フォロワー</Tabs.Tab>
          <Tabs.Tab value="following">フォロー中</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="followers">
          <UsersList
            users={followers}
            currentUserId={currentUserId}
          />
        </Tabs.Panel>
        <Tabs.Panel value="following">
          <UsersList
            users={followingUsers}
            currentUserId={currentUserId}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
