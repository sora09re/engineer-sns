import { Box, Center, Flex, Loader } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";
import useSWR from "swr";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { PostsList } from "@/components/PostsList/PostsList";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { getCurrentUser } from "@/services/server/getCurrentUser";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface PostsDataProps {
  currentUser: User;
  postsFromServerSideProps: PostType[];
}

const Index: NextPage<PostsDataProps> = ({ currentUser }) => {
  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<PostType[]>(`/api/posts?currentUserId=${currentUser.id}`, fetcher);

  if (error) {
    return <div>エラーが発生しました。再度、更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} mutate={mutate} />
      <Box w="100%" ml={sideBarWidthBase}>
        <NewPostForm currentUser={currentUser} mutate={mutate} />
        {isLoading ? (
          <Center mt={200}>
            <Loader />
          </Center>
        ) : (
          <PostsList posts={posts} currentUser={currentUser} mutate={mutate} />
        )}
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = await getCurrentUser({ context });
  return currentUser;
};

export default Index;
