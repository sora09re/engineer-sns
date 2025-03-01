import useSWR from "swr";

import type { PostType } from "@/types/post";
import { fetcher } from "@/utils/fetcher";

export const useGetTimelinePosts = (currentUserId: string | undefined) => {
  const shouldFetch = currentUserId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<PostType[]>(
    shouldFetch ? `/api/posts?currentUserId=${currentUserId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
