import { useMutation, useQueryClient } from "@tanstack/react-query";

import { afterPostsChanged, api, ensureOk } from "@/shared/api";

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (content: string) => {
			await ensureOk(await api.api.posts.$post({ json: { content } }));
		},
		onSuccess: () => afterPostsChanged(queryClient),
	});
};
