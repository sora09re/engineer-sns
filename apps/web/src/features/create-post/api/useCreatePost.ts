import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, ensureOk, queryKeys } from "@/shared/api";

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (content: string) => {
			await ensureOk(await api.api.posts.$post({ json: { content } }));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};
