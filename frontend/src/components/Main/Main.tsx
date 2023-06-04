import { Col, Container, Grid } from "@mantine/core";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { Post } from "@/components/Post/Post";
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
