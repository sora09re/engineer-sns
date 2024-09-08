import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

export const useGetPostsForUser = (userId: string | undefined) => {
  const shouldFetch = userId !== undefined;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/profile/posts/${userId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
