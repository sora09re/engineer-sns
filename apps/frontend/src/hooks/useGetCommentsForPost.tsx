import useSWR from "swr";

import { useGetToken } from "@/hooks/useGetToken";
import type { PostType } from "@/types/post";
import { tokenFetcher } from "@/utils/fetcher";

export const useGetCommentsForPost = (postId: string | null | undefined) => {
  const token = useGetToken();
  const shouldFetch = postId != null;

  const { data, error, isLoading, mutate } = useSWR<PostType[]>(
    shouldFetch ? { token, url: `/posts/${postId}/comments` } : null,
    tokenFetcher
  );

  return { data, error, isLoading, mutate };
};
