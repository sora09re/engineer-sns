import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { api, ensureOk, queryKeys } from "@/shared/api";
import { withUploadedImage } from "@/entities/user";

/**
 * 更新系のフック。widgets / pages の api セグメントに移すまでの置き場所。
 * 成功後に関係するクエリを無効化し、再取得が終わるまで pending のままにする。
 */

export const useCreateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ content, postId }: { content: string; postId: string }) => {
			await ensureOk(
				await api.api.posts[":postId"].comments.$post({ param: { postId }, json: { content } }),
			);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postId: string) => {
			await ensureOk(await api.api.posts[":postId"].$delete({ param: { postId } }));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

/** いいねする・外す。すでにその状態でも成功する */
export const useToggleLike = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ like, postId }: { like: boolean; postId: string }) => {
			const endpoint = api.api.posts[":postId"].like;
			const args = { param: { postId } };
			await ensureOk(await (like ? endpoint.$put(args) : endpoint.$delete(args)));
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

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

/** ログイン中のアカウントのユーザーを編集する */
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
