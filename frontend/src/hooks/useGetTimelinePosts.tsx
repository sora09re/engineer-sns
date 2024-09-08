import useSWR from "swr";

import { useGetToken } from "@/hooks/useGetToken";
import type { PostType } from "@/types/post";
import { tokenFetcher } from "@/utils/fetcher";

export const useGetTimelinePosts = (currentUserId: string | undefined) => {
  const token = useGetToken();
  const shouldFetch = currentUserId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<PostType[]>(
    shouldFetch
      ? { token, url: `/posts?currentUserId=${currentUserId}` }
      : null,
    tokenFetcher
  );
  return { data, error, isLoading, mutate };
};
