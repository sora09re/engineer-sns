import { Box, Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";

import { Post } from "@/components/Post/Post";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { PostData } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface PostDetailProps {
  currentUser: Pick<User, "id" | "name" | "username" | "profile_image_url">;
  post: PostData;
}

const PostDetail: NextPage<PostDetailProps> = ({ currentUser, post }) => {
  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box ml={sideBarWidthBase} w="100%">
        <Post post={post} currentUser={currentUser} />
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

  const res = await axios.get(`${baseURL}/api/posts/${postId}`);
  const post: PostData = res.data;

  return {
    props: {
      currentUser,
      post,
    },
  };
};

export default PostDetail;
