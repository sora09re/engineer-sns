import { Col, Container, Grid } from "@mantine/core";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { Post } from "@/features/posts-feature/Post/Post";
import type { PostsProps } from "@/pages/_app";

export const Main = ({ posts, setPosts }: PostsProps) => {
  return (
    <Container>
      <Grid>
        <Col span={8} offset={2}>
          <NewPostForm posts={posts} setPosts={setPosts} />
          {posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
        </Col>
      </Grid>
    </Container>
  );
};
