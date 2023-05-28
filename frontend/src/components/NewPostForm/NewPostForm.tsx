import { Button, Paper, Space, Textarea } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Post = {
  id: number;
  content: string;
};

type NewPostFormProps = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
};

export const NewPostForm = ({ posts, setPosts }: NewPostFormProps) => {
  const [postContent, setPostContent] = useState("");
  const handlePost = () => {
    const newPost = {
      id: posts.length + 1,
      content: postContent,
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
