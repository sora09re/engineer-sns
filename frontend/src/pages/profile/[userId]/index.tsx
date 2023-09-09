import { Box, Center, Flex, Loader } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useGetPostsForUser } from "@/hooks/useGetPostsForUser";
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
  const {
    data: postsForUser,
    error: getPostsForUserError,
    isLoading: getPostsForUserIsLoading,
  } = useGetPostsForUser(userId);

  if (getCurrentUserIsLoading || !currentUser) {
    return <CenteredLoader />;
  }

  if (getCurrentUserError || getProfileError || getPostsForUserError) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Profile user={user} currentUserId={currentUser.id} />
        {getPostsForUserIsLoading ? (
          <Center mt={100}>
            <Loader />
          </Center>
        ) : (
          <PostsList posts={postsForUser} currentUserId={currentUser.id} />
        )}
      </Box>
      <EditProfileModal currentUser={currentUser} />
    </Flex>
  );
};

export default ProfilePage;
