import { Box, Center, Flex, Loader, Space } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { CommentForm } from "@/components/CommentForm/CommentForm";
import { CommentList } from "@/components/CommentList/CommentList";
import { Post } from "@/components/Post/Post";
import { PreviousPageHeader } from "@/components/PreviousPageHeader/PreviousPageHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCommentsForPost } from "@/hooks/useGetCommentsForPost";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useGetPostDetail } from "@/hooks/useGetPostDetail";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

const PostDetailPage: NextPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const {
    data: currentUser,
    error: getCurrentUserError,
    isLoading: getCurrentUserIsLoading,
  } = useGetCurrentUser();

  const { data: post, error: getPostError } = useGetPostDetail(postId);
  const {
    data: comments,
    error: getCommentsError,
    isLoading,
  } = useGetCommentsForPost(postId);

  if (!currentUser || getCurrentUserIsLoading || !post) {
    return <CenteredLoader />;
  }

  if (getCurrentUserError || getPostError || getCommentsError) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
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
          <Center mt={100}>
            <Loader />
          </Center>
        ) : (
          <CommentList currentUser={currentUser} comments={comments || []} />
        )}
      </Box>
    </Flex>
  );
};

export default PostDetailPage;
