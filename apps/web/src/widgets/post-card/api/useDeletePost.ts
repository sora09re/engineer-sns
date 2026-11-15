import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, ensureOk, queryKeys } from "@/shared/api";

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postId: string) => {
			await ensureOk(await api.api.posts[":postId"].$delete({ param: { postId } }));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};
