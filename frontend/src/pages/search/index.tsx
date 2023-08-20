import { Box, Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";

import { Search } from "@/components/Search/Search";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface SearchPageProps {
  currentUser: User;
}

const SearchPage: NextPage<SearchPageProps> = ({ currentUser }) => {
  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Search />
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

export default SearchPage;
