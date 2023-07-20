import { Box, Space } from "@mantine/core";
import { useRecoilState } from "recoil";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { Post } from "@/features/posts-feature/Post/Post";
import { postsState } from "@/stores/postsState";

export const Main = () => {
  const [posts] = useRecoilState(postsState);
  return (
    <Box w="90%" px="md">
      <NewPostForm />
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
