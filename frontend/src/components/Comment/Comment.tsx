import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import { useEffect, useState } from "react";

import {
  ContentPart,
  parseContent,
} from "@/components/ContentPart/ContentPart";
import { useModal } from "@/hooks/useModal";
import type { CommentProps } from "@/types/comment";

export const Comment = ({ comment }: CommentProps) => {
  const [likes, setLikes] = useState(comment ? comment.likesCount : 0);
  const [liked, setLiked] = useState(false);

  const [, setIsVisible] = useModal("comment");

  useEffect(() => {
    if (comment) {
      setLikes(comment.likesCount);
    }
  }, [comment]);

  const handleLikeClick = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  if (!comment) {
    return null;
  }

  const parsedContent = parseContent(comment.content);

  return (
    <Paper key={comment.id} p="md" shadow="xs">
      <Flex>
        {/* TODO ツイートユーザープロフィール画像に変更 */}
        <Avatar src={null} alt="no image here" />
        <Space w="md" />
        <div>
          <Group spacing="xs">
            {/* TODO ツイートユーザー名に変更 */}
            <Text fw={700}>John Doe</Text>
            <Text color="gray">@johndoe</Text>
            <Text color="gray">{comment.createdAt.toLocaleString()}</Text>
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
              <Text>
                {comment.comments.length ? comment.comments.length : 0}
              </Text>
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
