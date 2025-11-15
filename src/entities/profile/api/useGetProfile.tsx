import useSWR from "swr";

import { baseURL, fetcher } from "@/shared/lib";
import type { ProfileType } from "../model/types";

export const useGetProfile = (userId: string) => {
	const shouldFetch = userId !== undefined;
	const { data, error, isLoading, mutate } = useSWR<ProfileType>(
		shouldFetch ? `${baseURL}/api/profile/${userId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
