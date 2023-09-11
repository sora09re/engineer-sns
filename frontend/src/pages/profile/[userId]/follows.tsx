import { Box, Flex } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { Follows } from "@/components/Follows/Follows";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

const FollowsPage: NextPage = () => {
  const {
    data: currentUser,
    error: getCurrentUserError,
    isLoading: getCurrentUserIsLoading,
  } = useGetCurrentUser();
  const router = useRouter();
  const userId = router.query.userId as string;

  if (!currentUser || getCurrentUserIsLoading) {
    return <CenteredLoader />;
  }

  if (getCurrentUserError) {
    <div>エラーが発生しました。更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Follows currentUserId={currentUser.id} userId={userId} />
      </Box>
    </Flex>
  );
};

export default FollowsPage;
