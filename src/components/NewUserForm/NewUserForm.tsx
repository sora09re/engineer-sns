import {
	Button,
	Container,
	Flex,
	Grid,
	Group,
	Paper,
	TextInput,
	Textarea,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useCreateCurrentUser } from "@/hooks/mutations";
import { useImageFile } from "@/hooks/useImageFile";
import { useUserValues } from "@/hooks/useUserValues";
import type { Account } from "@/types/account";

interface NewUserFormProps {
	account: Account;
}

export const NewUserForm = ({ account }: NewUserFormProps) => {
	const navigate = useNavigate();
	const { imageFile, previewUrl, selectImage } = useImageFile();
	const { updateValues, values } = useUserValues({
		bio: "",
		email: account.email ?? "",
		location: "",
		name: account.name ?? "",
		profile_image_url: account.avatarUrl ?? "",
		username: "",
		website: "",
	});
	const createUser = useCreateCurrentUser();

	const isValid = [values.name, values.username, values.email].every((value) => value.trim());

	const handleSubmit = () => {
		createUser.mutate(
			{ imageFile, values },
			{
				onSuccess: () => navigate({ to: "/" }),
				onError: () => {
					notifications.show({
						id: "create-user-error",
						autoClose: 2000,
						color: "red",
						icon: <IconX size="1rem" />,
						message: "ユーザー登録に失敗しました。ユーザーネームが重複している可能性があります。",
						title: "エラー",
					});
				},
			},
		);
	};

	return (
		<Container size={400} p={20}>
			<Paper p="md">
				<Title order={4} ta="center">
					ユーザー新規登録
				</Title>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
					style={{ marginTop: 15 }}
				>
					<Flex justify="center">
						<ImageUpload onDrop={selectImage} imageUrl={previewUrl || values.profile_image_url} />
					</Flex>
					<Grid>
						<Grid.Col style={{ marginTop: 5 }}>
							<TextInput
								label="名前"
								placeholder="Your name"
								value={values.name}
								withAsterisk
								onChange={(e) => {
									return updateValues({ name: e.currentTarget.value });
								}}
							/>
						</Grid.Col>
						<Grid.Col style={{ marginTop: 5 }}>
							<TextInput
								label="ユーザーネーム"
								placeholder="Your username"
								value={values.username}
								withAsterisk
								onChange={(e) => {
									return updateValues({ username: e.currentTarget.value });
								}}
							/>
						</Grid.Col>
						<Grid.Col style={{ marginTop: 5 }}>
							<TextInput
								label="メールアドレス"
								placeholder="Your email"
								value={values.email}
								withAsterisk
								onChange={(e) => {
									return updateValues({ email: e.currentTarget.value });
								}}
							/>
						</Grid.Col>
						<Grid.Col style={{ marginTop: 5 }}>
							<Textarea
								label="自己紹介"
								placeholder="Your bio"
								value={values.bio}
								onChange={(e) => {
									return updateValues({ bio: e.currentTarget.value });
								}}
								maxLength={160}
							/>
						</Grid.Col>
						<Grid.Col style={{ marginTop: 5 }}>
							<TextInput
								label="場所"
								placeholder="Your location"
								value={values.location}
								onChange={(e) => {
									return updateValues({ location: e.currentTarget.value });
								}}
							/>
						</Grid.Col>
						<Grid.Col style={{ marginTop: 5 }}>
							<TextInput
								label="ウェブサイト"
								placeholder="Your website"
								value={values.website}
								onChange={(e) => {
									return updateValues({ website: e.currentTarget.value });
								}}
							/>
						</Grid.Col>
					</Grid>
					<Group justify="flex-end" style={{ marginTop: 15 }}>
						<Button type="submit" color="blue" loading={createUser.isPending} disabled={!isValid}>
							送信
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
};
