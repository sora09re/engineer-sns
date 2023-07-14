import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";

import { Profile } from "@/components/Profile/Profile";
import type { UserProps } from "@/types/user";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const baseURL = process.env.SERVER
    ? process.env.SERVER
    : "http://localhost:3000";
  const res = await axios.get<string[]>(`${baseURL}/api/${userId}`);
  return { props: { user: res.data } };
};

const ProfilePage: NextPage<UserProps> = ({ user }) => {
  return <Profile propsUser={user} />;
};

export default ProfilePage;
