import { Group, Text } from "@mantine/core";
import Link from "next/link";

import type { ProfileType } from "@/types/profile";

interface ProfileStatsProps {
  user: ProfileType;
}

export const ProfileStats = ({ user }: ProfileStatsProps) => {
  const stats = [
    { label: "フォロー中", value: user.followings.length },
    { label: "フォロワー", value: user.followers.length },
  ];

  return (
    <Group my="md" position="center" spacing={30}>
      {stats.map((stat) => {
        return (
          <Link
            key={stat.label}
            href={`/profile/${user.id}/follows`}
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
