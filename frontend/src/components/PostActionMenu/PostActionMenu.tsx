import { Box, Menu } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons";
import { useState } from "react";

export const PostActionMenu = () => {
  const [opened, setOpened] = useState(false);
  
  return (
    <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
      <Menu.Target>
        <Box
          sx={{ position: "absolute", right: 20, top: 10 }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <IconDots />
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="red" icon={<IconTrash size={14} />} fw="bold">
          削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
