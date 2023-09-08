import useSWR from "swr";

import type { PostType } from "@/types/post";
import { fetcher } from "@/utils/fetcher";

export const useGetTimelinePosts = (currentUserId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR<PostType[]>(
    `/api/posts?currentUserId=${currentUserId}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
