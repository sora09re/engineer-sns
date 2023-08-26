import { Box, Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";

import { Follows } from "@/components/Follows/Follows";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface FollowsPageProps {
  currentUser: User;
}

const FollowsPage: NextPage<FollowsPageProps> = ({ currentUser }) => {
  const router = useRouter();
  const userId = router.query.userId as string;

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Follows currentUserId={currentUser.id} userId={userId} />
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

  return {
    props: {
      currentUser,
    },
  };
};

export default FollowsPage;
