import { Box, Flex } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";

import { Search } from "@/components/Search/Search";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { getCurrentUser } from "@/services/server/getCurrentUser";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface SearchPageProps {
  currentUser: User;
}

const SearchPage: NextPage<SearchPageProps> = ({ currentUser }) => {
  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Search currentUser={currentUser} />
      </Box>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = await getCurrentUser({ context });
  return currentUser;
};

export default SearchPage;
