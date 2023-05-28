import { Col, Container, Grid } from "@mantine/core";
import { useState } from "react";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { Post } from "@/components/Post/Post";

export const Main = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Hello, world! This is a tweet.",
    },
    {
      id: 2,
      content: "以下はコードです。```<p>Hello World!</p>```",
    },
    // 他のツイート...
  ]);
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
