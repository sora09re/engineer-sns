import { Post } from "@/components/Post/Post";
import type { PostType } from "@/types/post";

interface PostsListProps {
  currentUserId: string;
  posts: PostType[] | undefined;
}

export const PostsList = ({ currentUserId, posts }: PostsListProps) => {
  if (!posts) {
    return <></>;
  }

  return (
    <>
      {posts.map((post) => {
        return <Post key={post.id} post={post} currentUserId={currentUserId} />;
      })}
    </>
  );
};
