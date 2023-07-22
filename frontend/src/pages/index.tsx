import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";

import { Main } from "@/components/Main/Main";
import type { PostData } from "@/types/post";

interface PostsDataPataProps {
  posts: PostData[];
}

const currentUser = 5;

export const getServerSideProps: GetServerSideProps = async () => {
  // const userId = context.params?.userId;
  const baseURL = process.env.SERVER
    ? process.env.SERVER
    : "http://localhost:3000";
  const res = await axios.get(`${baseURL}/api/posts?userId=${currentUser}`);
  const posts = res.data;

  return {
    props: {
      posts,
    },
  };
};

const Index: NextPage<PostsDataPataProps> = ({ posts }) => {
  return <Main posts={posts} />;
};

export default Index;
