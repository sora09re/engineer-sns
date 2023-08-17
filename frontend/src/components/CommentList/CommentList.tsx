import { Box, Space } from "@mantine/core";
import type { User } from "next-auth";
import type { KeyedMutator } from "swr";

import { Post } from "@/components/Post/Post";
import type { PostType } from "@/types/post";

interface CommentListProps {
  comments: PostType[];
  currentUser: Pick<User, "id">;
  mutate: KeyedMutator<PostType[]>;
}

export const CommentList = ({
  comments,
  currentUser,
  mutate,
}: CommentListProps) => {
  return (
    <Box>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <Post post={comment} currentUser={currentUser} mutate={mutate} />
            <Space h={20} />
          </div>
        );
      })}
    </Box>
  );
};
