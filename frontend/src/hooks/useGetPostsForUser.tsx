import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

export const useGetPostsForUser = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/posts/${userId}/`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
