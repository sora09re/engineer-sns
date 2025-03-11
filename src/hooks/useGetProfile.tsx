import useSWR from "swr";

import type { ProfileType } from "@/types/profile";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetProfile = (userId: string) => {
	const shouldFetch = userId !== undefined;
	const { data, error, isLoading, mutate } = useSWR<ProfileType>(
		shouldFetch ? `${baseURL}/api/profile/${userId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
