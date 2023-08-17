import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import Link from "next/link";

import {
  ContentPart,
  parseContent,
} from "@/components/ContentPart/ContentPart";
import { DateFormat } from "@/components/DateFormat/DateFormat";
import type { PostType } from "@/types/post";

interface PostUIProps {
  handleLikeClick: (postId: string) => void;
  isLikedByCurrentUser: boolean;
  post: PostType;
}

export const PostUI = ({
  handleLikeClick,
  isLikedByCurrentUser,
  post,
}: PostUIProps) => {
  const parsedContent = parseContent(post.content);

  return (
    <Link
      href={`/posts/${post.id}`}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Paper key={post.id} p="md" shadow="xs" w="full">
        <Flex>
          <Avatar
            src={post.users.profile_image_url}
            alt="投稿したユーザーのプロフィール画像"
          />
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
                <Link href={`/posts/${post.id}`} style={{ height: "1.2rem" }}>
                  <IconMessageCircle2
                    size="1.2rem"
                    cursor="pointer"
                    color="black"
                  />
                </Link>
                <Space w="xs" />
                <Text>{post.comments ? post.comments.length : 0}</Text>
              </Flex>
              <Flex align="center">
                <IconThumbUp
                  size="1.2rem"
                  color={isLikedByCurrentUser ? "#228be6" : "black"}
                  cursor="pointer"
                  onClick={() => {
                    return handleLikeClick(post.id);
                  }}
                />
                <Space w="xs" />
                <Text>{post.likes.length}</Text>
              </Flex>
            </Group>
          </div>
        </Flex>
      </Paper>
    </Link>
  );
};
