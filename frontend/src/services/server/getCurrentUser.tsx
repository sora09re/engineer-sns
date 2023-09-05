import axios from "axios";
import type { GetServerSidePropsContext, PreviewData } from "next";
import { getServerSession } from "next-auth";
import type { ParsedUrlQuery } from "querystring";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseURL } from "@/utils/baseUrl";

interface getCurrentUserProps {
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>;
}

const fetchCurrentUser = async (userId: string | undefined) => {
  const response = await axios.get(`${baseURL}/api/users/current`, {
    params: { currentUserId: userId },
  });
  return response.data;
};

export const getCurrentUser = async ({ context }: getCurrentUserProps) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session?.user?.id;

  if (!userId) {
    return { props: { currentUser: null } };
  }

  const currentUser = await fetchCurrentUser(userId);
  return { props: { currentUser } };
};
