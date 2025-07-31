import useSWR from "swr";

import type { PostType } from "@/shared/entities";
import { baseURL, fetcher } from "@/shared/lib";

export const useGetPostDetail = (postId: string | undefined) => {
	const shouldFetch = postId !== undefined;
	const { data, error, isLoading, mutate } = useSWR<PostType>(
		shouldFetch ? `${baseURL}/api/posts/${postId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
