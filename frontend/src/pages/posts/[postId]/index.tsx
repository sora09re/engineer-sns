import { Box, Flex, Space } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import useSWR from "swr";

import { CommentForm } from "@/components/CommentForm/CommentForm";
import { CommentList } from "@/components/CommentList/CommentList";
import { Post } from "@/components/Post/Post";
import { PreviousPageHeader } from "@/components/PreviousPageHeader/PreviousPageHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface PostDetailProps {
  commentsFromServerSideProps: PostType[];
  currentUser: Pick<User, "id" | "name" | "username" | "profile_image_url">;
  postFromServerSideProps: PostType;
  postId: string;
}

const PostDetail: NextPage<PostDetailProps> = ({
  commentsFromServerSideProps,
  currentUser,
  postFromServerSideProps,
  postId,
}) => {
  const router = useRouter();

  const {
    data: post,
    error: getPostError,
    mutate: mutatePost,
  } = useSWR<PostType>(
    currentUser ? `${baseURL}/api/posts/${postId}` : null,
    fetcher,
    {
      fallbackData: postFromServerSideProps,
    }
  );

  const {
    data: comments,
    error: getCommentsError,
    mutate: mutateComments,
  } = useSWR<PostType[]>(
    currentUser ? `${baseURL}/api/posts/${postId}/comments` : null,
    fetcher,
    {
      fallbackData: commentsFromServerSideProps,
    }
  );

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
        <Post post={post} currentUser={currentUser} mutate={mutatePost} />
        <Space h="md" />
        <CommentForm
          currentUser={currentUser}
          mutates={[mutatePost, mutateComments]}
          postId={post.id}
        />
        <CommentList
          mutate={mutateComments}
          currentUser={currentUser}
          comments={comments || []}
        />
      </Box>
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

  const currentUserRes = await axios.get(`${baseURL}/api/users/current`, {
    params: {
      currentUserId: session?.user?.id,
    },
  });
  const currentUser = currentUserRes.data;
  const postId = context?.params?.postId;

  const postRes = await axios.get(`${baseURL}/api/posts/${postId}`);
  const postFromServerSideProps: PostType = postRes.data;

  const commentsRes = await axios.get(
    `${baseURL}/api/posts/${postId}/comments`
  );

  const commentsFromServerSideProps: PostType[] = commentsRes.data;

  return {
    props: {
      commentsFromServerSideProps,
      currentUser,
      postFromServerSideProps,
      postId,
    },
  };
};

export default PostDetail;
