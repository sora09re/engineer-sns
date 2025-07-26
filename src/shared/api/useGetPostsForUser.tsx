import useSWR from "swr";

import { baseURL, fetcher } from "@/shared/lib";

export const useGetPostsForUser = (userId: string | undefined) => {
	const shouldFetch = userId !== undefined;
	const { data, error, isLoading, mutate } = useSWR(
		shouldFetch ? `${baseURL}/api/profile/posts/${userId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
