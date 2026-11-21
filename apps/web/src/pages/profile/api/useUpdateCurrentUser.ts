import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { withUploadedImage } from "@/entities/user";
import { api, ensureOk, queryKeys } from "@/shared/api";

export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			const json = await withUploadedImage(values, imageFile);
			await ensureOk(await api.api.me.$patch({ json }));
		},
		onSuccess: () => {
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
				queryClient.invalidateQueries({ queryKey: queryKeys.follows }),
			]);
		},
	});
};
