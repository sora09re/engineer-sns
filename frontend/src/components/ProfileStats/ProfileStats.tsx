import { Group, Text } from "@mantine/core";

export const ProfileStats = () => {
  const stats = [
    { label: "フォロー中", value: "111" },
    { label: "フォロワー", value: "222" },
  ];

  return (
    <Group my="md" position="center" spacing={30}>
      {stats.map((stat) => {
        return (
          <div key={stat.label}>
            <Text ta="center" fz="lg" fw={500}>
              {stat.value}
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
              {stat.label}
            </Text>
          </div>
        );
      })}
    </Group>
  );
};
