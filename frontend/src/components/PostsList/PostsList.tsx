import type { KeyedMutator } from "swr";

import { Post } from "@/components/Post/Post";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";

interface PostsListProps {
  currentUser: User;
  mutate?: KeyedMutator<PostType> | KeyedMutator<PostType[]>;
  posts: PostType[];
}

export const PostsList = ({ currentUser, mutate, posts }: PostsListProps) => {
  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            post={post}
            currentUser={currentUser}
            mutate={mutate}
          />
        );
      })}
    </>
  );
};
