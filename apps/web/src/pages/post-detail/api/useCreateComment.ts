import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, ensureOk, queryKeys } from "@/shared/api";

export const useCreateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ content, postId }: { content: string; postId: string }) => {
			await ensureOk(
				await api.api.posts[":postId"].comments.$post({ param: { postId }, json: { content } }),
			);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};
