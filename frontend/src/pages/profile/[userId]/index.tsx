import { Box, Flex } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetProfile } from "@/hooks/useGetProfile";
import { getCurrentUser } from "@/services/server/getCurrentUser";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ currentUser }) => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { data: user, error } = useGetProfile(userId);

  if (error || !user) {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = await getCurrentUser({ context });
  return currentUser;
};

export default ProfilePage;
