import { Box, Tabs } from "@mantine/core";
import useSWR from "swr";

import { CenteredLoader } from "@/shared/components/CenteredLoader/CenteredLoader";
import { UsersList } from "@/shared/components/UsersList/UsersList";
import type { User } from "@/shared/entities";
import { fetcher } from "@/shared/lib";
import { baseURL } from "@/shared/lib/const";

interface FollowsProps {
	currentUserId: string;
	userId: string;
}

export const Follows = ({ currentUserId, userId }: FollowsProps) => {
	const {
		data: followers,
		error: getFollowersError,
		isLoading: getFollowersIsLoading,
	} = useSWR<User[]>(`${baseURL}/api/users/${userId}/followers`, fetcher);

	const {
		data: followingUsers,
		error: getFollowingUsersError,
		isLoading: getFollowingUsersIsLoading,
	} = useSWR<User[]>(`${baseURL}/api/users/${userId}/following`, fetcher);

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
