import { Box, NavLink } from "@mantine/core";
import { IconBell, IconHome2, IconUserCircle } from "@tabler/icons";

import { Button } from "../Button/Button";

const items = [
  {
    href: "/",
    icon: <IconHome2 size="1.5rem" stroke={1.5} />,
    label: "ホーム",
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
  return (
    <Box w={220}>
      {items.map((item) => {
        return <NavLink key={item.href} label={item.label} icon={item.icon} />;
      })}
      <Button />
    </Box>
  );
};
