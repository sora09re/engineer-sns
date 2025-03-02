import { Box, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDots, IconTrash, IconX } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";

import { useGetPostsForUser } from "@/hooks/useGetPostsForUser";
import { useGetTimelinePosts } from "@/hooks/useGetTimelinePosts";
import { useSearchPosts } from "@/hooks/useSearchPosts";
import { baseURL } from "@/utils/baseUrl";

interface PostActionMenuProps {
  currentUserId: string;
  keyword?: string;
  postId: string;
  postUserId: string;
}

export const PostActionMenu = ({
  currentUserId,
  keyword,
  postId,
  postUserId,
}: PostActionMenuProps) => {
  const [opened, setOpened] = useState(false);
  const { mutate: getTimelinePostsMutate } = useGetTimelinePosts(currentUserId);
  const { mutate: getPostsForUserMutate } = useGetPostsForUser(postUserId);
  const { mutate: getSearchPostsMutate } = useSearchPosts(keyword);

  const deletePost = async () => {
    notifications.show({
      id: "deletePost",
      autoClose: false,
      loading: true,
      message: "しばらくお待ちください。",
      title: "削除中...",
      withCloseButton: false,
    });
    try {
      await axios.delete(`${baseURL}/api/posts/${postId}`);
      notifications.update({
        id: "deletePost",
        autoClose: 2000,
        color: "green",
        icon: <IconCheck size="1rem" />,
        message: "削除しました。",
        title: "成功",
      });
      getTimelinePostsMutate();
      getPostsForUserMutate();
      getSearchPostsMutate();
    } catch (_error) {
      notifications.update({
        id: "deletePost",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "削除失敗しました。",
        title: "エラー",
      });
    }
  };

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
        <Menu.Item
          color="red"
          icon={<IconTrash size={14} />}
          fw="bold"
          onClick={(event) => {
            event.stopPropagation();
            deletePost();
          }}
        >
          削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
