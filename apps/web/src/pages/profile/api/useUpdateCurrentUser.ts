import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toUserValuesBody, type UserValuesSubmission } from "@/features/user-values-form";
import { afterLoginUserChanged, api, ensureOk } from "@/shared/api";

export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (submission: UserValuesSubmission) => {
			const json = await toUserValuesBody(submission);
			await ensureOk(await api.api.me.$patch({ json }));
		},
		onSuccess: () => afterLoginUserChanged(queryClient),
	});
};
