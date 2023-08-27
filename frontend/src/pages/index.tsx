import { Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";

import { Main } from "@/components/Main/Main";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

interface PostsDataProps {
  currentUser: User;
  postsFromServerSideProps: PostType[];
}

const Index: NextPage<PostsDataProps> = ({
  currentUser,
  postsFromServerSideProps,
}) => {
  const {
    data: posts,
    error,
    mutate,
  } = useSWR<PostType[]>(
    currentUser ? `/api/posts?currentUserId=${currentUser.id}` : null,
    fetcher,
    {
      fallbackData: postsFromServerSideProps,
    }
  );

  if (error) {
    return <div>エラーが発生しました。再度、更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} mutate={mutate} />
      {posts ? (
        <Main posts={posts} currentUser={currentUser} mutate={mutate} />
      ) : (
        <div>読み込み中...</div>
      )}
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

  const [currentUserRes, postsRes] = await Promise.all([
    axios.get(`${baseURL}/api/users/current`, {
      params: {
        currentUserId: session?.user?.id,
      },
    }),
    axios.get(`${baseURL}/api/posts`, {
      params: {
        currentUserId: session?.user?.id,
      },
    }),
  ]);

  const currentUser = currentUserRes.data;
  const postsFromServerSideProps = postsRes.data;

  return {
    props: {
      currentUser,
      postsFromServerSideProps,
    },
  };
};

export default Index;
