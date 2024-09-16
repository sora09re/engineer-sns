import useSWR from "swr";

import { useGetToken } from "@/hooks/useGetToken";
import type { PostType } from "@/types/post";
import { tokenFetcher } from "@/utils/fetcher";

export const useGetPostDetail = (postId: string | undefined) => {
  const token = useGetToken();
  const shouldFetch = postId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<PostType>(
    shouldFetch ? `/posts/${postId}?token=${token}` : null,
    tokenFetcher
  );
  return { data, error, isLoading, mutate };
};
