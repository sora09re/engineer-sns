import { Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconRotate, IconThumbUp } from "@tabler/icons";
import { useEffect, useState } from "react";

import {
  ContentPart,
  parseContent,
} from "@/features/posts-feature/ContentPart/ContentPart";
import { useModal } from "@/hooks/useModal";
import type { PostProps } from "@/types/post";

export const Post: React.FC<PostProps> = ({ post }) => {
  const [likes, setLikes] = useState(post ? post.likes : 0);
  const [liked, setLiked] = useState(false);

  const [, setIsVisible] = useModal("comment");

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
    }
  }, [post]);

  const handleLikeClick = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  if (!post) {
    return null;
  }

  const parsedContent = parseContent(post.content);

  return (
    <Paper key={post.id} p="md" shadow="xs" style={{ marginBottom: "20px" }}>
      {parsedContent.map((part, index) => {
        return <ContentPart key={index} part={part} />;
      })}
      <Space h="md" />
      <Group spacing="xl">
        <Flex align="center">
          <IconMessageCircle2
            size="1.2rem"
            cursor="pointer"
            onClick={() => {
              return setIsVisible(true);
            }}
          />
          <Space w="xs" />
          <Text>{post.comments}</Text>
        </Flex>
        <Flex align="center">
          <IconRotate size="1.2rem" cursor="pointer" />
          <Space w="xs" />
          <Text>{post.reposts}</Text>
        </Flex>
        <Flex align="center">
          <IconThumbUp
            size="1.2rem"
            color={liked ? "#228be6" : "black"}
            cursor="pointer"
            onClick={handleLikeClick}
          />
          <Space w="xs" />
          <Text>{likes}</Text>
        </Flex>
      </Group>
    </Paper>
  );
};
