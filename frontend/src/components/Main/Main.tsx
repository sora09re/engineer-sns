import { Box, Space } from "@mantine/core";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { Post } from "@/features/posts-feature/Post/Post";
import type { PostData } from "@/types/post";
import type { User } from "@/types/user";

interface MainProps {
  currentUser: Pick<User, "id">;
  posts: PostData[];
}

export const Main = ({ currentUser, posts }: MainProps) => {
  return (
    <Box w="90%" px="md">
      <NewPostForm currentUser={currentUser} />
      <Space h={20} />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post post={post} />
            <Space h={20} />
          </div>
        );
      })}
    </Box>
  );
};
