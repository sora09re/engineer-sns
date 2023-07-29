import { Box, Button, Space, Textarea } from "@mantine/core";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { useModal } from "@/hooks/useModal";
import { postsState } from "@/stores/postsState";

export const NewPostForm = () => {
  const [postContent, setPostContent] = useState("");
  const [, setIsVisible] = useModal("post");
  const [posts, setPosts] = useRecoilState(postsState);

  const handlePost = () => {
    const newPost = {
      id: 1,
      comments: [],
      content: postContent,
      createdAt: new Date(),
      isDeleted: false,
      likesCount: 0,
      repostsCount: 0,
      updatedAt: new Date(),
      userId: 1,
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
    setIsVisible(false);
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
        onClick={handlePost}
        disabled={postContent ? postContent.trim() === "" : true}
      >
        投稿する
      </Button>
    </Box>
  );
};
