import { Divider } from "@mantine/core";
import { useRecoilValue } from "recoil";

import { Comment } from "@/components/Comment/Comment";
import { Post } from "@/components/Post/Post";
import { postsState } from "@/stores/postsState";

export const PostWithComments = () => {
  const posts = useRecoilValue(postsState);
  const post = posts.find((post) => {
    return post.id === 1;
  });

  if (!post) {
    return <div>Post is not found</div>;
  }

  return (
    <>
      <Post post={post} />
      {post.comments.map((comment) => {
        return (
          <>
            <Divider
              size="md"
              orientation="vertical"
              h={40}
              sx={{ marginLeft: 32 }}
            />
            <Comment key={comment.id} comment={comment} />
          </>
        );
      })}
    </>
  );
};
