import useSWR from "swr";

import type { PostType } from "@/shared/types/post";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetPostDetail = (postId: string | undefined) => {
	const shouldFetch = postId !== undefined;
	const { data, error, isLoading, mutate } = useSWR<PostType>(
		shouldFetch ? `${baseURL}/api/posts/${postId}` : null,
		fetcher,
	);
	return { data, error, isLoading, mutate };
};
