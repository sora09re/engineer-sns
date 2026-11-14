import { useMutation, useQueryClient } from "@tanstack/react-query";

import { follow, unfollow } from "@/api/follows";
import { likePost, unlikePost } from "@/api/likes";
import { createComment, createPost, deletePost } from "@/api/posts";
import { queryKeys } from "@/api/queries";
import { createCurrentUser, updateCurrentUser, uploadProfileImage } from "@/api/users";
import type { UserValues } from "@engineer-sns/shared";

/**
 * 更新系のフック。成功後に関係するクエリを無効化し、再取得が終わるまで pending のままにする。
 */

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createPost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

export const useCreateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createComment,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

export const useToggleLike = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ like, postId }: { like: boolean; postId: string }) => {
			return like ? likePost(postId) : unlikePost(postId);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts }),
	});
};

export const useToggleFollow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ follow: shouldFollow, userId }: { follow: boolean; userId: string }) => {
			return shouldFollow ? follow(userId) : unfollow(userId);
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

export const useCreateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			await createCurrentUser(await withUploadedImage(values, imageFile));
		},
		// currentUser は /_authed の beforeLoad でしか読まれず非アクティブなので、明示的に再取得する
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: queryKeys.users, refetchType: "all" }),
	});
};

export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ imageFile, values }: { imageFile: File | null; values: UserValues }) => {
			await updateCurrentUser(await withUploadedImage(values, imageFile));
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
