import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetCurrentUser = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const { data, error, isLoading } = useSWR<User>(
    currentUserId
      ? `${baseURL}/api/users/current?currentUserId=${currentUserId}`
      : null,
    fetcher
  );

  if (typeof window !== "undefined" && !session) {
    router.push("/auth/signin");
  }

  if (!data) {
    <Center mt={200}>
      <Loader />
    </Center>;
  }

  return {
    data,
    error,
    isLoading,
  };
};
