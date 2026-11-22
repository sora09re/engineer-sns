import { useMutation, useQueryClient } from "@tanstack/react-query";

import { afterPostsChanged, api, ensureOk } from "@/shared/api";

export interface NewPost {
	content: string;
	parentPostId?: string;
}

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ content, parentPostId }: NewPost) => {
			const response =
				parentPostId === undefined
					? await api.api.posts.$post({ json: { content } })
					: await api.api.posts[":postId"].comments.$post({
							param: { postId: parentPostId },
							json: { content },
						});
			await ensureOk(response);
		},
		onSuccess: () => afterPostsChanged(queryClient),
	});
};
