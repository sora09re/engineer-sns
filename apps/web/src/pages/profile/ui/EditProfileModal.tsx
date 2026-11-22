import { Button, Center, Grid, Modal, Paper, Text, TextInput, Textarea } from "@mantine/core";

import { ImageUpload, useUserValues } from "@/entities/user";
import { useUpdateCurrentUser } from "../api/useUpdateCurrentUser";
import { notifyMutation, useImageFile } from "@/shared/lib";
import type { LoginUser } from "@engineer-sns/shared";
import { BIO_MAX_LENGTH, findUserValuesError } from "@engineer-sns/shared/rules";

interface EditProfileModalProps {
	currentUser: LoginUser;
	opened: boolean;
	onClose: () => void;
}

export const EditProfileModal = ({ currentUser, opened, onClose }: EditProfileModalProps) => {
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
	const updateUser = useUpdateCurrentUser();
	const valuesError = findUserValuesError(values);

	const editProfile = async () => {
		if (await notifyMutation(updateUser, { imageFile, values }, { label: "更新" })) {
			onClose();
			clearImage();
		}
	};

	return (
		<Modal opened={opened} onClose={onClose} title="プロフィールを編集" withCloseButton>
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
							maxLength={BIO_MAX_LENGTH}
							rows={4}
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

						{valuesError && (
							<Text c="red" size="sm" mt={marginTopPx} role="alert">
								{valuesError}
							</Text>
						)}
						<Button
							onClick={editProfile}
							loading={updateUser.isPending}
							disabled={valuesError !== null}
							mt={marginTopPx}
						>
							保存
						</Button>
					</Grid.Col>
				</Grid>
			</Paper>
		</Modal>
	);
};
