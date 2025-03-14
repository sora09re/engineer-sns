import useSWR from "swr";

import type { PostType } from "@/types/post";
import { baseURL } from "@/utils/baseUrl";
import { fetcher } from "@/utils/fetcher";

export const useGetCommentsForPost = (postId: string | null | undefined) => {
	const shouldFetch = postId != null; // nullまたはundefinedでない場合にtrue

	const { data, error, isLoading, mutate } = useSWR<PostType[]>(
		shouldFetch ? `${baseURL}/api/posts/${postId}/comments` : null, // 条件に応じてkeyをnullにする
		fetcher,
	);

	return { data, error, isLoading, mutate };
};
