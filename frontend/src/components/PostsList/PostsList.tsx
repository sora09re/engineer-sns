import { Flex } from "@mantine/core";

import { Post } from "@/components/Post/Post";
import type { PostType } from "@/types/post";

interface PostsListProps {
  currentUserId: string;
  keyword?: string;
  posts: PostType[] | undefined;
}

export const PostsList = ({
  currentUserId,
  keyword,
  posts,
}: PostsListProps) => {
  if (!posts) {
    return <></>;
  }

  if (posts.length === 0) {
    return (
      <Flex h="100%" justify="center" align="center">
        検索結果が見つかりませんでした。
      </Flex>
    );
  }

  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            keyword={keyword}
          />
        );
      })}
    </>
  );
};
