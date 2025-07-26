import useSWR from "swr";

import type { ProfileType } from "@/shared/types/profile";
import { baseURL } from "@/shared/utils/baseUrl";
import { fetcher } from "@/shared/utils/fetcher";

export const useGetProfile = (userId: string) => {
	const shouldFetch = userId !== undefined;
	const { data, error, isLoading, mutate } = useSWR<ProfileType>(
		shouldFetch ? `${baseURL}/api/profile/${userId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
