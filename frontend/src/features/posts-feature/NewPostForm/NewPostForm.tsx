import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface NewPostFormProps {
  currentUser: Pick<User, "id">;
  mutate: any;
}

export const NewPostForm = ({ currentUser, mutate }: NewPostFormProps) => {
  const [postContent, setPostContent] = useState("");

  const fetchPost = async () => {
    notifications.show({
      id: "post-data",
      autoClose: false,
      loading: true,
      message: "しばらくお待ちください。",
      title: "投稿中...",
      withCloseButton: false,
    });

    try {
      await axios.post(`${baseURL}/api/posts`, {
        currentUserId: currentUser.id,
        postContent: postContent,
      });
      setPostContent("");
      mutate();
      notifications.update({
        id: "post-data",
        autoClose: 2000,
        color: "green",
        icon: <IconCheck size="1rem" />,
        message: "投稿が成功しました！",
        title: "成功",
      });
    } catch (error) {
      notifications.update({
        id: "post-data",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "投稿に失敗しました。",
        title: "エラー",
      });
    }
  };

  return (
    <Box p="md" sx={{ borderBottom: "1px solid lightgray" }}>
      <Textarea
        placeholder="今どうしてる？"
        label="投稿内容"
        autosize
        minRows={5}
        maxRows={20}
        value={postContent || ""}
        onChange={(e) => {
          return setPostContent(e.currentTarget.value);
        }}
      />
      <Space h="md" />
      <Button
        fullWidth
        onClick={fetchPost}
        disabled={postContent ? postContent.trim() === "" : true}
      >
        投稿する
      </Button>
    </Box>
  );
};
