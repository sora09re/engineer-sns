import { Box, Center, Flex, Loader } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useGetProfile } from "@/hooks/useGetProfile";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const {
    data: currentUser,
    error: getCurrentUserError,
    isLoading: getCurrentUserIsLoading,
  } = useGetCurrentUser();
  const { data: user, error: getProfileError } = useGetProfile(userId);

  if (getCurrentUserIsLoading || !currentUser || !user) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  if (getProfileError || getCurrentUserError) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Profile user={user} currentUserId={currentUser.id} />
        <PostsList posts={user.posts} currentUserId={currentUser.id} />
      </Box>
      <EditProfileModal currentUser={currentUser} />
    </Flex>
  );
};

export default ProfilePage;
