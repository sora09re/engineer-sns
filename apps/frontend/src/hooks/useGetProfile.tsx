import useSWR from "swr";

import { useGetToken } from "@/hooks/useGetToken";
import type { ProfileType } from "@/types/profile";
import { tokenFetcher } from "@/utils/fetcher";

export const useGetProfile = (userId: string) => {
  const token = useGetToken();
  const shouldFetch = userId !== undefined;
  const { data, error, isLoading, mutate } = useSWR<ProfileType>(
    shouldFetch ? `/profile/${userId}?token=${token}` : null,
    tokenFetcher
  );
  return { data, error, isLoading, mutate };
};
