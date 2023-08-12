import { Box, Button, Space, Textarea } from "@mantine/core";
import axios from "axios";
import { useState } from "react";

import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface NewPostFormProps {
  currentUser: Pick<User, "id">;
}

export const NewPostForm = ({ currentUser }: NewPostFormProps) => {
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState<any>(null);

  const fetchPost = async () => {
    try {
      await axios.post(`${baseURL}/api/posts`, {
        currentUserId: currentUser.id,
        postContent: postContent,
      });

      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Box p="md" sx={{ borderBottom: "1px solid lightgray" }}>
      {error ? (
        <p style={{ color: "red" }}>投稿に失敗しました。</p>
      ) : (
        <p style={{ color: "green" }}>投稿が成功しました！</p>
      )}
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
