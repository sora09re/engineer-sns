import { Box, Center, Flex, Loader } from "@mantine/core";
import type { NextPage } from "next";

import { Search } from "@/components/Search/Search";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

const SearchPage: NextPage = () => {
  const {
    data: currentUser,
    error: getCurrentUserError,
    isLoading: getCurrentUserIsLoading,
  } = useGetCurrentUser();

  if (!currentUser || getCurrentUserIsLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  if (getCurrentUserError) {
    return <div>エラーが発生しました。再度、更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Search currentUser={currentUser} />
      </Box>
    </Flex>
  );
};

export default SearchPage;
