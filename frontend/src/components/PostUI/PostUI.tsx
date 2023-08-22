import {
  Avatar,
  Box,
  Group,
  Space,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const { hovered: hoveredComments, ref: refComments } = useHover();
  const { hovered: hoveredLikes, ref: refLikes } = useHover();
  const router = useRouter();

  const commentsColor = hoveredComments ? "#228be6" : "black";
  const likesColor = hoveredLikes
    ? "#37B24D"
    : isLikedByCurrentUser
    ? "#37B24D"
    : "black";

  return (
    <Box
      key={post.id}
      p="md"
      w="100%"
      sx={{ borderBottom: "1px solid #E9ECEF", cursor: "pointer" }}
      onClick={() => {
        return router.push(`/posts/${post.id}`);
      }}
    >
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
          <Group align="center" spacing={40}>
            <UnstyledButton>
              <Link
                href={`/posts/${post.id}`}
                style={{ textDecoration: "none" }}
              >
                <Tooltip label="コメント" position="bottom" withArrow>
                  <Group ref={refComments} align="center" spacing="sm">
                    <IconMessageCircle2 size="1.2rem" color={commentsColor} />
                    <Text color={commentsColor}>
                      {post.comments ? post.comments.length : 0}
                    </Text>
                  </Group>
                </Tooltip>
              </Link>
            </UnstyledButton>
            <UnstyledButton
              onClick={(event) => {
                event.stopPropagation();
                return handleLikeClick(post.id);
              }}
            >
              <Tooltip
                label={!isLikedByCurrentUser ? "いいね" : "いいねを取り消す"}
                position="bottom"
                withArrow
              >
                <Group ref={refLikes} align="center" spacing="sm">
                  <IconThumbUp size="1.2rem" color={likesColor} />
                  <Text color={likesColor}>{post.likes.length}</Text>
                </Group>
              </Tooltip>
            </UnstyledButton>
          </Group>
        </Box>
      </Group>
    </Box>
  );
};
