import { Box, Button, NavLink, Space, Text } from "@mantine/core";
import {
  IconBell,
  IconHome2,
  IconLogin,
  IconLogout,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons";
import { useState } from "react";

import { useModal } from "@/hooks/useModal";

const items = [
  {
    href: "/",
    icon: <IconHome2 size="1.5rem" stroke={1.5} />,
    label: "ホーム",
  },
  {
    href: "/search",
    icon: <IconSearch size="1.5rem" stroke={1.5} />,
    label: "検索",
  },
  {
    href: "/notifications",
    icon: <IconBell size="1.5rem" stroke={1.5} />,
    label: "通知",
  },
  {
    href: `/users/123`,
    icon: <IconUserCircle size="1.5rem" stroke={1.5} />,
    label: "プロフィール",
  },
];

export const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setIsVisiblePostModal] = useModal("post");
  const [, setIsVisibleLoginModal] = useModal("login");

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Box w={220}>
      {items.map((item) => {
        return <NavLink key={item.href} label={item.label} icon={item.icon} />;
      })}
      <Space h="lg" />
      <Button
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
    </Box>
  );
};
