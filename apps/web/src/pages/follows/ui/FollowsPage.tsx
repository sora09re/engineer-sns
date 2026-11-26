import { Box, Tabs } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

import { followeesQuery, followersQuery, userProfileDetail } from "@/entities/user";
import { UserItem } from "@/widgets/user-card";

interface FollowsPageProps {
	userId: string;
}

export const FollowsPage = ({ userId }: FollowsPageProps) => {
	userProfileDetail.useData(userId);
	const { data: followers } = useSuspenseQuery(followersQuery(userId));
	const { data: followees } = useSuspenseQuery(followeesQuery(userId));

	return (
		<Box p="md">
			<Tabs defaultValue="followers" mt="md">
				<Tabs.List grow justify="center">
					<Tabs.Tab value="followers">フォロワー</Tabs.Tab>
					<Tabs.Tab value="following">フォロー中</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="followers">
					{followers.map((user) => {
						return <UserItem key={user.id} propsUser={user} />;
					})}
				</Tabs.Panel>
				<Tabs.Panel value="following">
					{followees.map((user) => {
						return <UserItem key={user.id} propsUser={user} />;
					})}
				</Tabs.Panel>
			</Tabs>
		</Box>
	);
};
