import { Group, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

import type { ProfileType } from "@/types/profile";

interface ProfileStatsProps {
	user: ProfileType;
}

export const ProfileStats = ({ user }: ProfileStatsProps) => {
	const stats = [
		{ label: "フォロー中", value: user.followee_count },
		{ label: "フォロワー", value: user.follower_count },
	];

	return (
		<Group my="md" justify="center" gap={30}>
			{stats.map((stat) => {
				return (
					<Link
						key={stat.label}
						to="/profile/$userId/follows"
						params={{ userId: user.id }}
						style={{ color: "inherit", textDecoration: "none" }}
					>
						<Text ta="center" fz="lg" fw={500}>
							{stat.value}
						</Text>
						<Text ta="center" fz="sm" c="dimmed">
							{stat.label}
						</Text>
					</Link>
				);
			})}
		</Group>
	);
};
