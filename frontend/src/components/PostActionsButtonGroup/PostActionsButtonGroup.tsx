import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons";
import Link from "next/link";

import type { PostType } from "@/types/post";

interface PostActionsButtonGroupProps {
  handleLikeClick: (postId: string) => void;
  isLikedByCurrentUser: boolean;
  post: PostType;
}

export const PostActionsButtonGroup = ({
  handleLikeClick,
  isLikedByCurrentUser,
  post,
}: PostActionsButtonGroupProps) => {
  const { hovered: hoveredComments, ref: refComments } = useHover();
  const { hovered: hoveredLikes, ref: refLikes } = useHover();
  const commentsColor = hoveredComments ? "#228be6" : "black";
  const likesColor = hoveredLikes
    ? "#37B24D"
    : isLikedByCurrentUser
    ? "#37B24D"
    : "black";

  return (
    <Group align="center" spacing={40}>
      <UnstyledButton>
        <Link href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
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
  );
};
