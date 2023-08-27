import { Avatar, Box, Group, Space, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  ContentPart,
  parseContent,
} from "@/components/ContentPart/ContentPart";
import { DateFormat } from "@/components/DateFormat/DateFormat";
import { PostActionMenu } from "@/components/PostActionMenu/PostActionMenu";
import { PostActionsButtonGroup } from "@/components/PostActionsButtonGroup/PostActionsButtonGroup";
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
  const router = useRouter();

  return (
    <Box
      key={post.id}
      p="md"
      w="100%"
      sx={{
        borderBottom: "1px solid #E9ECEF",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => {
        return router.push(`/posts/${post.id}`);
      }}
    >
      <PostActionMenu />
      <Group align="start">
        <Box>
          <Link href={`/profile/${post.user_id}`}>
            <Avatar
              src={post.users.profile_image_url}
              alt="投稿したユーザーのプロフィール画像"
            />
          </Link>
        </Box>
        <Box>
          <Group spacing="xs">
            <Link
              href={`/profile/${post.user_id}`}
              style={{ textDecoration: "none" }}
            >
              <Text fw={700} color="black">
                {post.users.name}
              </Text>
            </Link>
            <Text color="dimmed">@{post.users.username}</Text>
            <Text color="dimmed">
              <DateFormat props={post.created_at} />
            </Text>
          </Group>
          {parsedContent.map((part, index) => {
            return <ContentPart key={index} part={part} />;
          })}
          <Space h="md" />
          <PostActionsButtonGroup
            handleLikeClick={handleLikeClick}
            isLikedByCurrentUser={isLikedByCurrentUser}
            post={post}
          />
        </Box>
      </Group>
    </Box>
  );
};
