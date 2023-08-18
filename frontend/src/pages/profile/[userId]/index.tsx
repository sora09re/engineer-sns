import { Flex } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";

import { Profile } from "@/components/Profile/Profile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { ProfileType } from "@/types/profile";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface ProfilePageProps {
  currentUser: User;
  user: ProfileType;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ currentUser, user }) => {
  return (
    <Flex>
      <Sidebar currentUser={currentUser} />
      <Profile user={user} currentUserId={currentUser.id} />
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
  const user = res.data;
  return { props: { currentUser, user } };
};

export default ProfilePage;
