import type { NextPage } from "next";

import { Main } from "@/components/Main/Main";
import type { PostsProps } from "@/pages/_app";

const Index: NextPage<PostsProps> = ({ posts, setPosts }) => {
  return <Main posts={posts} setPosts={setPosts} />;
};

export default Index;
