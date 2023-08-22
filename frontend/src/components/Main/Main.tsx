import { Box } from "@mantine/core";
import type { KeyedMutator } from "swr";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { PostsList } from "@/components/PostsList/PostsList";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface MainProps {
  currentUser: User;
  mutate: KeyedMutator<PostType[]>;
  posts: PostType[];
}

export const Main = ({ currentUser, mutate, posts }: MainProps) => {
  return (
    <Box w="100%" ml={sideBarWidthBase}>
      <NewPostForm currentUser={currentUser} mutate={mutate} />
      <PostsList posts={posts} currentUser={currentUser} mutate={mutate} />
    </Box>
  );
};
