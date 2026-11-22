import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { withUploadedImage } from "@/entities/user";
import { afterLoginUserChanged, api, ensureOk } from "@/shared/api";

export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			const json = await withUploadedImage(values, imageFile);
			await ensureOk(await api.api.me.$patch({ json }));
		},
		onSuccess: () => afterLoginUserChanged(queryClient),
	});
};
