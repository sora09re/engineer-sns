import { Avatar, Flex, Group, Paper, Space, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMessageCircle2, IconThumbUp, IconX } from "@tabler/icons";
import axios from "axios";
import Link from "next/link";

import {
  ContentPart,
  parseContent,
} from "@/components/ContentPart/ContentPart";
import { DateFormat } from "@/components/DateFormat/DateFormat";
import type { PostData } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface PostProps {
  currentUser: Pick<User, "id">;
  mutate?: any;
  post: PostData;
}

export const Post = ({ currentUser, mutate, post }: PostProps) => {
  if (!post) {
    return null;
  }

  const index = post.likes.findIndex((like) => {
    return like.post_id === post.id;
  });

  const isLikedByCurrentUser =
    index !== -1 && post.likes[index].user_id === currentUser.id;

  const handleLikeClick = async (postId: string) => {
    try {
      if (!isLikedByCurrentUser) {
        await axios.post(`${baseURL}/api/posts/${postId}/likes`, {
          currentUserId: currentUser.id,
        });
      } else {
        await axios.delete(`${baseURL}/api/posts/${postId}/likes`, {
          params: {
            currentUserId: currentUser.id,
          },
        });
      }
      mutate();
    } catch (error) {
      notifications.show({
        id: "click-likes",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "いいねに失敗しました。",
        title: "エラー",
      });
    }
  };

  const parsedContent = parseContent(post.content);

  return (
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
              <Text>{post.comments.length}</Text>
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
  );
};