import { useMutation, useQueryClient } from "@tanstack/react-query";

import { afterFollowChanged, api, ensureOk } from "@/shared/api";

export const useToggleFollow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ follow, userId }: { follow: boolean; userId: string }) => {
			const endpoint = api.api.users[":userId"].follow;
			const args = { param: { userId } };
			await ensureOk(await (follow ? endpoint.$put(args) : endpoint.$delete(args)));
		},
		onSettled: () => afterFollowChanged(queryClient),
	});
};
