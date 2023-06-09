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
  const [, setIsVisible] = useModal("post");

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Box w={220}>
      {items.map((item) => {
        return <NavLink key={item.href} label={item.label} icon={item.icon} />;
      })}
      <Button
        onClick={() => {
          return setIsVisible(true);
        }}
      >
        投稿する
      </Button>
      <Space h="md" />
      <Button onClick={handleLoginLogout}>
        {isLoggedIn ? (
          <>
            <IconLogout size="1.5rem" stroke={1.5} />
            <Text>ログアウト</Text>
          </>
        ) : (
          <>
            <IconLogin size="1.5rem" stroke={1.5} />
            <Text>ログイン</Text>
          </>
        )}
      </Button>
    </Box>
  );
};
