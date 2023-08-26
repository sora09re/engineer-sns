import { Box, Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";

import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { ProfileType } from "@/types/profile";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface ProfilePageProps {
  currentUser: User;
  userFromServerSideProps: ProfileType;
}

const ProfilePage: NextPage<ProfilePageProps> = ({
  currentUser,
  userFromServerSideProps,
}) => {
  const {
    data: user,
    error: getUserProfileError,
    mutate,
  } = useSWR<ProfileType>(
    `${baseURL}/api/profile/${userFromServerSideProps.id}`,
    fetcher,
    {
      fallbackData: userFromServerSideProps,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (getUserProfileError || !user) {
    return <div>エラーが発生しました。更新を行ってください。</div>;
  }

  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Box w="100%" ml={sideBarWidthBase}>
        <Profile user={user} currentUserId={currentUser.id} mutate={mutate} />
        <PostsList posts={user.posts} currentUser={currentUser} />
      </Box>
      <EditProfileModal currentUser={currentUser} mutate={mutate} />
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

  const userId = context.params?.userId;
  const res = await axios.get(`${baseURL}/api/profile/${userId}`);
  const userFromServerSideProps = res.data;
  return { props: { currentUser, userFromServerSideProps } };
};

export default ProfilePage;
