import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";

export const useHandleNewUser = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user.id;
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User>(
    currentUserId ? `/users?userId=${currentUserId}` : null,
    fetcher
  );

  if (user?.username) {
    router.push("/");
  }

  return {
    error,
    isLoading,
    mutate,
    session,
    status,
  };
};
