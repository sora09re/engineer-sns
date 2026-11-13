import { Button, Center, Grid, Modal, Paper, TextInput, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useUpdateCurrentUser } from "@/hooks/mutations";
import { useImageFile } from "@/hooks/useImageFile";
import { useModal } from "@/hooks/useModal";
import { useUserValues } from "@/hooks/useUserValues";
import type { User } from "@/types/user";

interface EditProfileModalProps {
	currentUser: User;
}

export const EditProfileModal = ({ currentUser }: EditProfileModalProps) => {
	const marginTopPx = 10;
	const { updateValues, values } = useUserValues({
		bio: currentUser.bio ?? "",
		email: currentUser.email,
		location: currentUser.location ?? "",
		name: currentUser.name,
		profile_image_url: currentUser.profile_image_url ?? "",
		username: currentUser.username,
		website: currentUser.website ?? "",
	});
	const { clearImage, imageFile, previewUrl, selectImage } = useImageFile();
	const [isVisible, setIsVisible] = useModal("editProfile");
	const updateUser = useUpdateCurrentUser();

	const editProfile = () => {
		notifications.show({
			id: "updateProfile",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "更新中...",
			withCloseButton: false,
		});

		updateUser.mutate(
			{ imageFile, values },
			{
				onSuccess: () => {
					setIsVisible(false);
					clearImage();
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
			},
		);
	};

	return (
		<Modal
			opened={isVisible}
			onClose={() => {
				return setIsVisible(false);
			}}
			title="プロフィールを編集"
			withCloseButton
		>
			<Paper p="md">
				<Grid grow>
					<Grid.Col span={4}>
						<Center>
							<ImageUpload onDrop={selectImage} imageUrl={previewUrl || values.profile_image_url} />
						</Center>
						<TextInput
							label="名前"
							placeholder={values.name}
							value={values.name}
							onChange={(e) => {
								return updateValues({ name: e.currentTarget.value });
							}}
							mt={marginTopPx}
						/>
						<TextInput
							label="ユーザー名"
							placeholder={values.username}
							value={values.username}
							onChange={(e) => {
								return updateValues({ username: e.currentTarget.value });
							}}
							mt={marginTopPx}
						/>
						<Textarea
							label="自己紹介"
							placeholder={values.bio}
							value={values.bio}
							onChange={(e) => {
								return updateValues({ bio: e.currentTarget.value });
							}}
							maxLength={160}
							minRows={4}
							mt={marginTopPx}
						/>
						<TextInput
							label="場所"
							placeholder={values.location}
							value={values.location}
							onChange={(e) => {
								return updateValues({ location: e.currentTarget.value });
							}}
							mt={marginTopPx}
						/>
						<TextInput
							label="ウェブサイト"
							placeholder={values.website}
							value={values.website}
							onChange={(e) => {
								return updateValues({ website: e.currentTarget.value });
							}}
							mt={marginTopPx}
						/>

						<Button onClick={editProfile} loading={updateUser.isPending} mt={marginTopPx}>
							保存
						</Button>
					</Grid.Col>
				</Grid>
			</Paper>
		</Modal>
	);
};
