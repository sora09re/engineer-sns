import useSWR from "swr";

import type { ProfileType } from "@/types/profile";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetProfile = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR<ProfileType>(
    `${baseURL}/api/profile/${userId}`,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
