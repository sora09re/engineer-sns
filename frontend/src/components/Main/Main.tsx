import { Col, Container, Grid } from "@mantine/core";
import { useRecoilState } from "recoil";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { Post } from "@/features/posts-feature/Post/Post";
import { postsState } from "@/stores/postsState";

export const Main = () => {
  const [posts] = useRecoilState(postsState);
  return (
    <Container>
      <Grid>
        <Col span={8} offset={2}>
          <NewPostForm />
          {posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
        </Col>
      </Grid>
    </Container>
  );
};
