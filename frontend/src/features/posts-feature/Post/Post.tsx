import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import { useEffect, useState } from "react";

import { DateFormat } from "@/components/DateFormat/DateFormat";
import {
  ContentPart,
  parseContent,
} from "@/features/posts-feature/ContentPart/ContentPart";
import { useModal } from "@/hooks/useModal";
import type { PostDataProps } from "@/types/post";

export const Post = ({ post }: PostDataProps) => {
  const [likes, setLikes] = useState(post ? post.likes.length : 0);
  const [liked, setLiked] = useState(false);

  const [, setIsVisible] = useModal("comment");

  useEffect(() => {
    if (post) {
      setLikes(post.likes.length);
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
    <Paper key={post.id} p="md" shadow="xs">
      <Flex>
        {/* TODO ツイートユーザープロフィール画像に変更 */}
        <Avatar src={null} alt="no image here" />
        <Space w="md" />
        <div>
          <Group spacing="xs">
            <Text fw={700}>{post.users.name}</Text>
            <Text color="dimmed">@{post.users.username}</Text>
            <Text color="dimmed">
              <DateFormat props={post.created_at} />
            </Text>
          </Group>
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
              <Text>{post.comments.length}</Text>
            </Flex>
            <Flex align="center">
              <IconThumbUp
                size="1.2rem"
                color={liked ? "#228be6" : "black"}
                cursor="pointer"
                onClick={handleLikeClick}
              />
              <Space w="xs" />
              <Text>{post.likes.length}</Text>
            </Flex>
          </Group>
        </div>
      </Flex>
    </Paper>
  );
};
