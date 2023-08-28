import useSWR from "swr";

import type { PostType } from "@/types/post";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetCommentsForPost = (postId: string) => {
  const { data, error, isLoading, mutate } = useSWR<PostType[]>(
    `${baseURL}/api/posts/${postId}/comments`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
