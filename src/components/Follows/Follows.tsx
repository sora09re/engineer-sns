import { Box, Tabs } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";

import { followeesQuery, followersQuery } from "@/api/queries";
import { UsersList } from "@/components/UsersList/UsersList";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface FollowsProps {
	userId: string;
}

export const Follows = ({ userId }: FollowsProps) => {
	const currentUser = useCurrentUser();
	const { data: followers } = useSuspenseQuery(followersQuery(userId));
	const { data: followees } = useSuspenseQuery(followeesQuery(userId));

	return (
		<Box p="md">
			<Tabs defaultValue="followers" mt="md">
				<Tabs.List grow position="center">
					<Tabs.Tab value="followers">フォロワー</Tabs.Tab>
					<Tabs.Tab value="following">フォロー中</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="followers">
					<UsersList users={followers} currentUserId={currentUser.id} />
				</Tabs.Panel>
				<Tabs.Panel value="following">
					<UsersList users={followees} currentUserId={currentUser.id} />
				</Tabs.Panel>
			</Tabs>
		</Box>
	);
};
