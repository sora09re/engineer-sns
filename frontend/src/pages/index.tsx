import { Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";

import { Main } from "@/components/Main/Main";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { PostData } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface PostsDataPataProps {
  currentUser: Pick<User, "name" | "username" | "profile_image_url">;
  posts: PostData[];
}

const Index: NextPage<PostsDataPataProps> = ({ currentUser, posts }) => {
  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Main posts={posts} />
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user || !session.user.id) {
    console.error("Session or user ID is not available");
    return {
      props: {
        posts: [],
      },
    };
  }

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login", // ログインページやエラーページへのリダイレクト先を指定
        permanent: false,
      },
    };
  }

  const currentUserRes = await axios.get(
    `${baseURL}/api/users/current?currentUserId=${session?.user?.id}`
  );

  const currentUser = currentUserRes.data;

  const postsRes = await axios.get(
    `${baseURL}/api/posts?currentUserId=${session?.user?.id}`
  );
  const posts = postsRes.data;

  return {
    props: {
      currentUser,
      posts,
    },
  };
};

export default Index;
