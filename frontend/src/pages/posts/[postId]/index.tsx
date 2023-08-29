import { Box, Center, Flex, Loader, Space } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { CommentForm } from "@/components/CommentForm/CommentForm";
import { CommentList } from "@/components/CommentList/CommentList";
import { Post } from "@/components/Post/Post";
import { PreviousPageHeader } from "@/components/PreviousPageHeader/PreviousPageHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCommentsForPost } from "@/hooks/useGetCommentsForPost";
import { useGetPostDetail } from "@/hooks/useGetPostDetail";
import { getCurrentUser } from "@/services/server/getCurrentUser";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface PostDetailPageProps {
  currentUser: User;
}

const PostDetailPage: NextPage<PostDetailPageProps> = ({ currentUser }) => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { data: post, error: getPostError } = useGetPostDetail(postId);
  const {
    data: comments,
    error: getCommentsError,
    isLoading,
  } = useGetCommentsForPost(postId);

  if (getPostError || getCommentsError) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
  }

  if (!post) {
    return <div>投稿の情報が取得できませんでした。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box ml={sideBarWidthBase} w="100%">
        <PreviousPageHeader router={router} />
        <Post post={post} currentUserId={currentUser.id} />
        <Space h="md" />
        <CommentForm currentUser={currentUser} postId={post.id} />
        {isLoading ? (
          <Center mt={200}>
            <Loader />
          </Center>
        ) : (
          <CommentList currentUser={currentUser} comments={comments || []} />
        )}
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = await getCurrentUser({ context });
  return currentUser;
};

export default PostDetailPage;
