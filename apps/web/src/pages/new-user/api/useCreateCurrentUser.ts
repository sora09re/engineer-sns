import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { withUploadedImage } from "@/entities/user";
import { afterUserRegistered, api, ensureOk } from "@/shared/api";

export const useCreateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			const json = await withUploadedImage(values, imageFile);
			await ensureOk(await api.api.me.$post({ json }));
		},
		onSuccess: () => afterUserRegistered(queryClient),
	});
};
