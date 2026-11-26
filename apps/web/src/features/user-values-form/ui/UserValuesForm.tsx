import { Button, Flex, Grid, Group, Text, TextInput, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

import type { UserValues } from "@engineer-sns/shared";
import { BIO_MAX_LENGTH, findUserValuesError } from "@engineer-sns/shared/rules";

import type { UserValuesSubmission } from "../api/submission";
import { ImageUpload } from "./ImageUpload";

interface UserValuesFormProps {
	initialValues: UserValues;
	withEmail: boolean;
	submitLabel: string;
	isSubmitting: boolean;
	onSubmit: (submission: UserValuesSubmission) => void;
}

type TextField = Exclude<keyof UserValues, "profile_image_url">;

const usePreviewUrl = (imageFile: File | null) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	useEffect(() => {
		if (!imageFile) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(imageFile);
		setPreviewUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [imageFile]);
	return previewUrl;
};

export const UserValuesForm = ({
	initialValues,
	withEmail,
	submitLabel,
	isSubmitting,
	onSubmit,
}: UserValuesFormProps) => {
	const [values, setValues] = useState<UserValues>(initialValues);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const previewUrl = usePreviewUrl(imageFile);
	const valuesError = findUserValuesError(values);

	const bind = (field: TextField) => {
		return {
			value: values[field] ?? "",
			onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				const value = event.currentTarget.value;
				setValues((prev) => {
					return { ...prev, [field]: value };
				});
			},
		};
	};

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				if (valuesError === null) {
					onSubmit({ imageFile, values });
				}
			}}
		>
			<Flex justify="center">
				<ImageUpload
					onDrop={(files) => {
						setImageFile(files[0] ?? null);
					}}
					imageUrl={previewUrl || values.profile_image_url}
				/>
			</Flex>
			<Grid>
				<Grid.Col style={{ marginTop: 5 }}>
					<TextInput label="名前" placeholder="Your name" withAsterisk {...bind("name")} />
				</Grid.Col>
				<Grid.Col style={{ marginTop: 5 }}>
					<TextInput
						label="ユーザーネーム"
						placeholder="Your username"
						withAsterisk
						{...bind("username")}
					/>
				</Grid.Col>
				{withEmail && (
					<Grid.Col style={{ marginTop: 5 }}>
						<TextInput
							label="メールアドレス"
							placeholder="Your email"
							withAsterisk
							{...bind("email")}
						/>
					</Grid.Col>
				)}
				<Grid.Col style={{ marginTop: 5 }}>
					<Textarea
						label="自己紹介"
						placeholder="Your bio"
						maxLength={BIO_MAX_LENGTH}
						{...bind("bio")}
					/>
				</Grid.Col>
				<Grid.Col style={{ marginTop: 5 }}>
					<TextInput label="場所" placeholder="Your location" {...bind("location")} />
				</Grid.Col>
				<Grid.Col style={{ marginTop: 5 }}>
					<TextInput label="ウェブサイト" placeholder="Your website" {...bind("website")} />
				</Grid.Col>
			</Grid>
			{valuesError && (
				<Text c="red" size="sm" role="alert" style={{ marginTop: 15 }}>
					{valuesError}
				</Text>
			)}
			<Group justify="flex-end" style={{ marginTop: 15 }}>
				<Button type="submit" color="blue" loading={isSubmitting} disabled={valuesError !== null}>
					{submitLabel}
				</Button>
			</Group>
		</form>
	);
};
