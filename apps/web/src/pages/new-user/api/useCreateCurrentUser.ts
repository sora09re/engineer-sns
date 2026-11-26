import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toUserValuesBody, type UserValuesSubmission } from "@/features/user-values-form";
import { afterUserRegistered, api, ensureOk } from "@/shared/api";

export const useCreateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (submission: UserValuesSubmission) => {
			const json = await toUserValuesBody(submission);
			await ensureOk(await api.api.me.$post({ json }));
		},
		onSuccess: () => afterUserRegistered(queryClient),
	});
};
