import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UserValues } from "@engineer-sns/shared";

import { api, ensureOk, queryKeys } from "@/shared/api";
import { uploadProfileImage } from "./profile-image";

/**
 * 更新系のフック。API を呼ぶのはここの mutationFn だけ（読み取りは queries.ts の queryFn）。
 * 成功後に関係するクエリを無効化し、再取得が終わるまで pending のままにする。
 */

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (content: string) => {
			await ensureOk(await api.api.posts.$post({ json: { content } }));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

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

/** プロフィール画像があればアップロードしてから値に反映する */
const withUploadedImage = async (values: UserValues, imageFile: File | null) => {
	if (!imageFile) {
		return values;
	}
	return { ...values, profile_image_url: await uploadProfileImage(imageFile) };
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
