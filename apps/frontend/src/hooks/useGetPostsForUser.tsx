import useSWR from "swr";

import { useGetToken } from "@/hooks/useGetToken";
import { tokenFetcher } from "@/utils/fetcher";

export const useGetPostsForUser = (userId: string | undefined) => {
  const token = useGetToken();

  const shouldFetch = userId !== undefined;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/profile/posts/${userId}?token=${token}` : null,
    tokenFetcher
  );

  return { data, error, isLoading, mutate };
};
