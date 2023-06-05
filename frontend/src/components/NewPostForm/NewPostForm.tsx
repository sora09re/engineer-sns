import { Button, Paper, Space, Textarea } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { Post } from "@/pages/_app";

type NewPostsProps = {
  posts: Post[];
  setModalOpened?: (opened: boolean) => void;
  setPosts: Dispatch<SetStateAction<Post[]>>;
};

export const NewPostForm = ({
  posts,
  setModalOpened,
  setPosts,
}: NewPostsProps) => {
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
    if (setModalOpened) {
      setModalOpened(false);
    }
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
