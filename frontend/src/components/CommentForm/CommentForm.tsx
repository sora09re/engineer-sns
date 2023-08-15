import { Box, Button, Space, Textarea } from "@mantine/core";
import { useState } from "react";

export const CommentForm = () => {
  const [commentContent, setCommentContent] = useState("");

  return (
    <Box p="md" sx={{ borderBottom: "1px solid lightgray" }}>
      <Textarea
        placeholder="今どうしてる？"
        label="投稿内容"
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
        // onClick={fetchComment}
        disabled={commentContent ? commentContent.trim() === "" : true}
      >
        投稿する
      </Button>
    </Box>
  );
};
