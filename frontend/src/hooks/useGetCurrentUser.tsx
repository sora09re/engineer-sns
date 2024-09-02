import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR from "swr";

import type { User } from "@/types/user";
import { apiUrl } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetCurrentUser = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user.id;
  const { data, error, isLoading, mutate } = useSWR<User>(
    currentUserId ? `${apiUrl}/users?userId=${currentUserId}` : null,
    fetcher
  );

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      status === "unauthenticated" &&
      !session
    ) {
      router.push("/auth/signin");
    }

    if (
      (status === "authenticated" && !isLoading && !data) ||
      (data && !data?.username)
    ) {
      router.push("/auth/new-user");
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
