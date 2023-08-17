import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";
import type { KeyedMutator } from "swr";

import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface CommentFormProps {
  currentUser: Pick<User, "id">;
  mutates: (KeyedMutator<PostType> | KeyedMutator<PostType[]>)[];
  postId: string;
}

export const CommentForm = ({
  currentUser,
  mutates,
  postId,
}: CommentFormProps) => {
  const [commentContent, setCommentContent] = useState("");

  const fetchComment = async () => {
    notifications.show({
      id: "fetchComment",
      autoClose: false,
      loading: true,
      message: "しばらくお待ちください。",
      title: "コメント中...",
      withCloseButton: false,
    });

    try {
      await axios.post(`${baseURL}/api/posts/${postId}/comments`, {
        commentContent: commentContent,
        currentUserId: currentUser.id,
      });
      setCommentContent("");
      mutates.forEach((m) => {
        return m();
      });
      notifications.update({
        id: "fetchComment",
        autoClose: 2000,
        color: "green",
        icon: <IconCheck size="1rem" />,
        message: "コメントが成功しました！",
        title: "成功",
      });
    } catch (error) {
      notifications.update({
        id: "fetchComment",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "コメントに失敗しました。",
        title: "エラー",
      });
    }
  };

  return (
    <Box p="md" sx={{ borderBottom: "1px solid #E9ECEF" }}>
      <Textarea
        placeholder="コメント"
        autosize
        minRows={5}
        maxRows={20}
        value={commentContent || ""}
        onChange={(e) => {
          return setCommentContent(e.currentTarget.value);
        }}
      />
      <Space h="md" />
      <Button
        fullWidth
        onClick={fetchComment}
        disabled={commentContent ? commentContent.trim() === "" : true}
      >
        コメントする
      </Button>
    </Box>
  );
};
