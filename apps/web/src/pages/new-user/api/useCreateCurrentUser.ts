import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { withUploadedImage } from "@/entities/user";
import { api, ensureOk, queryKeys } from "@/shared/api";

/** 新規ユーザー登録: ログイン中のアカウントにユーザーを作る */
export const useCreateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			const json = await withUploadedImage(values, imageFile);
			await ensureOk(await api.api.me.$post({ json }));
		},
		// currentUser は /_authed の beforeLoad でしか読まれず非アクティブなので、明示的に再取得する
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queryKeys.users, refetchType: "all" }),
	});
};
