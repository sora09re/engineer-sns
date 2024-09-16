import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR from "swr";

import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";

export const useGetCurrentUser = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user.id;
  const { data, error, isLoading, mutate } = useSWR<User>(
    currentUserId ? `/users?userId=${currentUserId}` : null,
    fetcher
  );

  useEffect(() => {
    if (status === "unauthenticated" && !session) {
      router.push("/auth/signin");
      return;
    }

    if (
      (status === "authenticated" && !isLoading && !data) ||
      (data && !data?.username)
    ) {
      router.push("/auth/new-user");
      return;
    }
  }, [router, data, status, isLoading, session]);

  if (!data) {
    return { loading: true };
  }

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
