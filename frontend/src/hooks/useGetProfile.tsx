import useSWR from "swr";

import type { ProfileType } from "@/types/profile";
import { fetcher } from "@/utils/fetcher";

export const useGetProfile = (userId: string) => {
  const shouldFetch = userId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<ProfileType>(
    shouldFetch ? `/profile/${userId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
