import useSWR from "swr";

import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetPostsForUser = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${baseURL}/api/profile/posts/${userId}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
