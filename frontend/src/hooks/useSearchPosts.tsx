import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

export const useSearchPosts = (keyword: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/search/posts?keyword=${keyword}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
