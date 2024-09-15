import { Box, Tabs } from "@mantine/core";
import useSWR from "swr";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { UsersList } from "@/components/UsersList/UsersList";
import { useGetToken } from "@/hooks/useGetToken";
import type { User } from "@/types/user";
import { tokenFetcher } from "@/utils/fetcher";

interface FollowsProps {
  currentUserId: string;
  userId: string;
}

export const Follows = ({ currentUserId, userId }: FollowsProps) => {
  const token = useGetToken();

  const {
    data: followers,
    error: getFollowersError,
    isLoading: getFollowersIsLoading,
  } = useSWR<User[]>(
    { token, url: `/users/${userId}/followers` },
    tokenFetcher
  );

  const {
    data: followingUsers,
    error: getFollowingUsersError,
    isLoading: getFollowingUsersIsLoading,
  } = useSWR<User[]>(
    { token, url: `/users/${userId}/followings` },
    tokenFetcher
  );

  if (
    getFollowersIsLoading ||
    getFollowingUsersIsLoading ||
    !followers ||
    !followingUsers
  ) {
    return <CenteredLoader />;
  }

  if (getFollowersError || getFollowingUsersError) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
  }

  return (
    <Box p="md">
      <Tabs defaultValue="followers" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="followers">フォロワー</Tabs.Tab>
          <Tabs.Tab value="following">フォロー中</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="followers">
          <UsersList users={followers} currentUserId={currentUserId} />
        </Tabs.Panel>
        <Tabs.Panel value="following">
          <UsersList users={followingUsers} currentUserId={currentUserId} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
