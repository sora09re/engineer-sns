import { Box, Tabs } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

import { followeesQuery, followersQuery, useCurrentUser } from "@/entities/user";
import { UserItem } from "@/widgets/user-card";

interface FollowsPageProps {
	userId: string;
}

export const FollowsPage = ({ userId }: FollowsPageProps) => {
	const currentUser = useCurrentUser();
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
						return <UserItem key={user.id} propsUser={user} currentUserId={currentUser.id} />;
					})}
				</Tabs.Panel>
				<Tabs.Panel value="following">
					{followees.map((user) => {
						return <UserItem key={user.id} propsUser={user} currentUserId={currentUser.id} />;
					})}
				</Tabs.Panel>
			</Tabs>
		</Box>
	);
};
