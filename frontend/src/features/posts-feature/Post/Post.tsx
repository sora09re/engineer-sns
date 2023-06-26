import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconRotate, IconThumbUp } from "@tabler/icons";
import { useEffect, useState } from "react";

import {
  ContentPart,
  parseContent,
} from "@/features/posts-feature/ContentPart/ContentPart";
import { useModal } from "@/hooks/useModal";
import type { PostProps } from "@/types/post";

export const Post = ({ post }: PostProps) => {
  const [likes, setLikes] = useState(post ? post.likesCount : 0);
  const [liked, setLiked] = useState(false);

  const [, setIsVisible] = useModal("comment");

  useEffect(() => {
    if (post) {
      setLikes(post.likesCount);
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
            {/* TODO ツイートユーザー名に変更 */}
            <Text fw={700}>John Doe</Text>
            <Text color="gray">@johndoe</Text>
            <Text color="gray">{post.createdAt.toLocaleString()}</Text>
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
              <Text>{post.comments.length ? post.comments.length : 0}</Text>
            </Flex>
            <Flex align="center">
              <IconRotate size="1.2rem" cursor="pointer" />
              <Space w="xs" />
              <Text>{post.repostsCount}</Text>
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
        </div>
      </Flex>
    </Paper>
  );
};