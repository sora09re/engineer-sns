import { useSession } from "next-auth/react";

export const useGetToken = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return token;
};
