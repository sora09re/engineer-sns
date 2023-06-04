import { Button, Paper, Space, Textarea } from "@mantine/core";
import { useState } from "react";

import type { PostsProps } from "@/pages/_app";

export const NewPostForm = ({ posts, setPosts }: PostsProps) => {
  const [postContent, setPostContent] = useState("");
  const handlePost = () => {
    const newPost = {
      id: posts.length + 1,
      comments: 0,
      content: postContent,
      likes: 0,
      reposts: 0,
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
  };

  return (
    <Paper p="md" shadow="xs" style={{ marginBottom: "20px" }}>
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
        onClick={handlePost}
        disabled={postContent ? postContent.trim() === "" : true}
      >
        投稿する
      </Button>
    </Paper>
  );
};
