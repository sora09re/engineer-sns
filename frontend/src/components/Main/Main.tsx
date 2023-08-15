import { Box, Space } from "@mantine/core";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { Post } from "@/features/posts-feature/Post/Post";
import type { PostData } from "@/types/post";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface MainProps {
  currentUser: Pick<User, "id">;
  mutate: any;
  posts: PostData[];
}

export const Main = ({ currentUser, mutate, posts }: MainProps) => {
  return (
    <Box w="90%" px="md" ml={sideBarWidthBase}>
      <NewPostForm currentUser={currentUser} mutate={mutate} />
      <Space h={20} />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <Post post={post} currentUser={currentUser} mutate={mutate} />
            <Space h={20} />
          </div>
        );
      })}
    </Box>
  );
};
