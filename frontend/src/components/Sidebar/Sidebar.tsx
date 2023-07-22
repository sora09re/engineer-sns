import {
  Avatar,
  Button,
  Group,
  Navbar,
  Space,
  Text,
  UnstyledButton,
} from "@mantine/core";

import { LoginButton } from "@/components/LoginButton/LoginButton";
import { MainLinks } from "@/components/MainLinks/MainLinks";
import { useModal } from "@/hooks/useModal";

export const Sidebar = () => {
  const [, setIsVisiblePostModal] = useModal("post");

  return (
    <Navbar width={{ base: 350 }} p="xl">
      <Navbar.Section grow mt="md" px="20px">
        <MainLinks />
        <Space h="xl" />
        <Button
          sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
          onClick={() => {
            return setIsVisiblePostModal(true);
          }}
        >
          投稿する
        </Button>
        <Space h="md" />
        <LoginButton />
      </Navbar.Section>
      <Navbar.Section>
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
      </Navbar.Section>
    </Navbar>
  );
};
