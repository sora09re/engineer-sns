import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, ensureOk, queryKeys } from "@/shared/api";

/** フォローする・外す。すでにその状態でも成功する */
export const useToggleFollow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ follow, userId }: { follow: boolean; userId: string }) => {
			const endpoint = api.api.users[":userId"].follow;
			const args = { param: { userId } };
			await ensureOk(await (follow ? endpoint.$put(args) : endpoint.$delete(args)));
		},
		onSettled: () => {
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.follows }),
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
			]);
		},
	});
};
