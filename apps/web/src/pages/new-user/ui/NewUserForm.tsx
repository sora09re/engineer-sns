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
import { useNavigate } from "@tanstack/react-router";

import { ImageUpload, useUserValues } from "@/entities/user";
import { useCreateCurrentUser } from "../api/useCreateCurrentUser";
import { notifyMutation, useImageFile } from "@/shared/lib";
import type { Account } from "@engineer-sns/shared";
import { BIO_MAX_LENGTH, findUserValuesError } from "@engineer-sns/shared/rules";

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

	const isValid = findUserValuesError(values) === null;

	const handleSubmit = async () => {
		const notice = { label: "ユーザー登録", report: "failure" } as const;
		if (await notifyMutation(createUser, { imageFile, values }, notice)) {
			await navigate({ to: "/" });
		}
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
						void handleSubmit();
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
								maxLength={BIO_MAX_LENGTH}
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
