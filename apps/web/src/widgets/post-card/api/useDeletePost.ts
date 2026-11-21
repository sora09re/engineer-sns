import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, ensureOk, queryKeys } from "@/shared/api";

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postId: string) => {
			await ensureOk(await api.api.posts[":postId"].$delete({ param: { postId } }));
		},
		onSuccess: async (_, postId) => {
			await queryClient.invalidateQueries({ queryKey: queryKeys.posts, refetchType: "none" });
			await queryClient.refetchQueries({
				queryKey: queryKeys.posts,
				type: "active",
				predicate: (query) => !query.queryKey.includes(postId),
			});
		},
	});
};
