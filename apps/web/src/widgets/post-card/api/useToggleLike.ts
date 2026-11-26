import { useMutation, useQueryClient } from "@tanstack/react-query";

import { afterPostsChanged, api, ensureOk } from "@/shared/api";

export const useToggleLike = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ like, postId }: { like: boolean; postId: string }) => {
			const endpoint = api.api.posts[":postId"].like;
			const args = { param: { postId } };
			await ensureOk(await (like ? endpoint.$put(args) : endpoint.$delete(args)));
		},
		onSettled: () => afterPostsChanged(queryClient),
	});
};
