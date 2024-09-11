import useSWR from "swr";

import type { PostType } from "@/types/post";
import { fetcher } from "@/utils/fetcher";

export const useGetPostDetail = (postId: string | undefined) => {
  const shouldFetch = postId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<PostType>(
    shouldFetch ? `/posts/${postId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
