import { Modal, Paper } from "@mantine/core";
import { useState } from "react";

import { UserValuesForm, type UserValuesSubmission } from "@/features/user-values-form";
import { useUpdateCurrentUser } from "../api/useUpdateCurrentUser";
import { notifyMutation } from "@/shared/lib";
import type { LoginUser } from "@engineer-sns/shared";

interface EditProfileModalProps {
	currentUser: LoginUser;
	opened: boolean;
	onClose: () => void;
}

export const EditProfileModal = ({ currentUser, opened, onClose }: EditProfileModalProps) => {
	const updateUser = useUpdateCurrentUser();
	const [openCount, setOpenCount] = useState(opened ? 1 : 0);
	const [wasOpened, setWasOpened] = useState(opened);
	if (opened !== wasOpened) {
		setWasOpened(opened);
		if (opened) {
			setOpenCount(openCount + 1);
		}
	}

	const editProfile = async (submission: UserValuesSubmission) => {
		if (await notifyMutation(updateUser, submission, { label: "更新" })) {
			onClose();
		}
	};

	return (
		<Modal opened={opened} onClose={onClose} title="プロフィールを編集" withCloseButton>
			<Paper p="md">
				<UserValuesForm
					key={openCount}
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
					onSubmit={(submission) => {
						void editProfile(submission);
					}}
				/>
			</Paper>
		</Modal>
	);
};
