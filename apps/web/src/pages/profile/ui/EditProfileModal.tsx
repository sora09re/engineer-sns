import { Modal, Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { UserValuesForm, type UserValuesSubmission } from "@/features/user-values-form";
import { useUpdateCurrentUser } from "../api/useUpdateCurrentUser";
import type { LoginUser } from "@engineer-sns/shared";

interface EditProfileModalProps {
	currentUser: LoginUser;
	opened: boolean;
	onClose: () => void;
}

export const EditProfileModal = ({ currentUser, opened, onClose }: EditProfileModalProps) => {
	const updateUser = useUpdateCurrentUser();

	const editProfile = (submission: UserValuesSubmission) => {
		notifications.show({
			id: "updateProfile",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "更新中...",
			withCloseButton: false,
		});

		updateUser.mutate(submission, {
			onSuccess: () => {
				onClose();
				notifications.update({
					id: "updateProfile",
					autoClose: 2000,
					color: "green",
					icon: <IconCheck size="1rem" />,
					message: "更新に成功しました！",
					title: "成功",
				});
			},
			onError: () => {
				notifications.update({
					id: "updateProfile",
					autoClose: 2000,
					color: "red",
					icon: <IconX size="1rem" />,
					message: "更新に失敗しました。",
					title: "エラー",
				});
			},
		});
	};

	return (
		<Modal opened={opened} onClose={onClose} title="プロフィールを編集" withCloseButton>
			<Paper p="md">
				<UserValuesForm
					initialValues={{
						bio: currentUser.bio ?? "",
						email: currentUser.email,
						location: currentUser.location ?? "",
						name: currentUser.name,
						profile_image_url: currentUser.profile_image_url ?? "",
						username: currentUser.username,
						website: currentUser.website ?? "",
					}}
					withEmail={false}
					submitLabel="保存"
					isSubmitting={updateUser.isPending}
					onSubmit={editProfile}
				/>
			</Paper>
		</Modal>
	);
};
