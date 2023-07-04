import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import { format, parseISO } from "date-fns";
import ja from "date-fns/locale/ja";
import { useEffect, useState } from "react";

import {
  ContentPart,
  parseContent,
} from "@/features/posts-feature/ContentPart/ContentPart";
import { useModal } from "@/hooks/useModal";
import type { PostProps } from "@/types/post";

const Date = ({ dateString }: { dateString: string }) => {
  return (
    <time dateTime={dateString}>
      {format(parseISO(dateString), "yyyy年MM月dd日 hh:mm", { locale: ja })}
    </time>
  );
};

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
            <Date dateString={post.createdAt.toString()} />
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
