import { Box } from "@mantine/core";
import type { User } from "next-auth";

import { Post } from "@/components/Post/Post";
import type { PostType } from "@/types/post";

interface CommentListProps {
  comments: PostType[];
  currentUser: Pick<User, "id">;
}

export const CommentList = ({ comments, currentUser }: CommentListProps) => {
  return (
    <Box>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <Post post={comment} currentUserId={currentUser.id} />
          </div>
        );
      })}
    </Box>
  );
};
