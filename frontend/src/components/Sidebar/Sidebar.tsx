import {
  Avatar,
  Button,
  Group,
  Navbar,
  Space,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconLogin, IconLogout } from "@tabler/icons";
import { useState } from "react";

import { MainLinks } from "@/components/MainLinks/MainLinks";
import { useModal } from "@/hooks/useModal";

export const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setIsVisiblePostModal] = useModal("post");
  const [, setIsVisibleLoginModal] = useModal("login");
  // const router = useRouter();

  // const handleClick = async (href: string) => {
  //   await router.push(href);
  // };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

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
        {isLoggedIn ? (
          <Button onClick={handleLoginLogout}>
            <IconLogout size="1.5rem" stroke={1.5} />
            <Text>ログアウト</Text>
          </Button>
        ) : (
          <Button
            onClick={() => {
              return setIsVisibleLoginModal(true);
            }}
          >
            <IconLogin size="1.5rem" stroke={1.5} />
            <Text>ログイン</Text>
          </Button>
        )}
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
