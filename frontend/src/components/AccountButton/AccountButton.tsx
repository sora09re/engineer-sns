import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { useSession } from "next-auth/react";

export const AccountButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <UnstyledButton>
        <Group>
          <Avatar size={40} color="blue">
            BH
          </Avatar>
          <div>
            <Text>Bob Handsome</Text>
            <Text size="xs" color="dimmed">
              bob@handsome.inc
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    );
  }
  return <></>;
};
