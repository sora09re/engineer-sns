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

interface PostProps {
  currentUserId: string;
  keyword?: string;
  post: PostType;
}

export const Post = ({ currentUserId, keyword, post }: PostProps) => {
  const parsedContent = parseContent(post.content);
  const router = useRouter();
  const isPostByCurrentUser = post.userId === currentUserId;

  if (!post) {
    return null;
  }

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
      {isPostByCurrentUser ? (
        <PostActionMenu
          postId={post.id}
          currentUserId={currentUserId}
          postUserId={post.userId}
          keyword={keyword}
        />
      ) : (
        <></>
      )}
      <Group align="start">
        <Box>
          <Link href={`/profile/${post.userId}`}>
            <Avatar
              src={post.user.profileImageUrl}
              alt="投稿したユーザーのプロフィール画像"
            />
          </Link>
        </Box>
        <Box>
          <Group spacing="xs">
            <Link
              href={`/profile/${post.userId}`}
              style={{ textDecoration: "none" }}
            >
              <Text fw={700} color="black">
                {post.user.name}
              </Text>
            </Link>
            <Text color="dimmed">@{post.user.username}</Text>
            <Text color="dimmed">
              <DateFormat props={post.createdAt} />
            </Text>
          </Group>
          {parsedContent.map((part, index) => {
            return <ContentPart key={index} part={part} />;
          })}
          <Space h="md" />
          <PostActionsButtonGroup currentUserId={currentUserId} post={post} />
        </Box>
      </Group>
    </Box>
  );
};
