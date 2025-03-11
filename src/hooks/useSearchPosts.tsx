import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

export const useSearchPosts = (keyword: string | undefined) => {
	const shouldFetch = keyword !== undefined;
	const { data, error, isLoading, mutate } = useSWR(
		shouldFetch ? `/api/search/posts?keyword=${keyword}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
