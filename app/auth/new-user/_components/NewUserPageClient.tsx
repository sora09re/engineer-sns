"use client";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import {
	type NewUserValues,
	useNewUserProfile,
} from "@/hooks/useNewUserProfile";
import { baseURL } from "@/shared/utils/baseUrl";
import { uploadImageToSupabase } from "@/shared/utils/uploadImageToSupabase";
import {
	Button,
	Col,
	Container,
	Flex,
	Grid,
	Group,
	Paper,
	TextInput,
	Textarea,
	Title,
} from "@mantine/core";
import axios from "axios";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NewUserPageClientProps {
	session: Session;
}

export default function NewUserPageClient({ session }: NewUserPageClientProps) {
	const { updateUserProfile, userProfile } = useNewUserProfile(session?.user);
	const router = useRouter();
	const [tempImage, setTempImage] = useState<string | null>(null);

	const handleDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		const objectURL = URL.createObjectURL(file);
		setTempImage(objectURL);
	};

	useEffect(() => {
		if (session?.user?.id) {
			updateUserProfile({
				email: session.user.email,
				profile_image_url: session.user.image,
			});
		}
	}, [session, updateUserProfile]);

	const postNewUser = async (values: NewUserValues) => {
		try {
			const imageUrl = await uploadImageToSupabase(
				tempImage,
				session?.user?.id,
			);
			if (imageUrl) {
				updateUserProfile({ profile_image_url: imageUrl });
			}
			const res = await axios.post(`${baseURL}/api/auth/signup`, values);
			if (res.status === 200) {
				// ステータスが200の場合
				router.push("/"); // ページ"/"に遷移
			}
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	return (
		<Container size={400} p={20}>
			<Paper p="md">
				<Title order={4} align="center">
					ユーザー新規登録
				</Title>
				<form
					onSubmit={(event) => {
						event.preventDefault();
					}}
					style={{ marginTop: 15 }}
				>
					<Flex justify="center">
						<ImageUpload
							onDrop={handleDrop}
							imageUrl={tempImage || userProfile.profile_image_url}
						/>
					</Flex>
					<Grid>
						<Col style={{ marginTop: 5 }}>
							<TextInput
								label="名前"
								placeholder="Your name"
								value={userProfile.name}
								withAsterisk
								onChange={(e) => {
									return updateUserProfile({ name: e.currentTarget.value });
								}}
							/>
						</Col>
						<Col style={{ marginTop: 5 }}>
							<TextInput
								label="ユーザーネーム"
								placeholder="Your username"
								value={userProfile.username}
								withAsterisk
								onChange={(e) => {
									return updateUserProfile({ username: e.currentTarget.value });
								}}
							/>
						</Col>
						<Col style={{ marginTop: 5 }}>
							<TextInput
								label="メールアドレス"
								placeholder="Your email"
								value={userProfile.email}
								withAsterisk
								onChange={(e) => {
									return updateUserProfile({ email: e.currentTarget.value });
								}}
							/>
						</Col>
						<Col style={{ marginTop: 5 }}>
							<Textarea
								label="自己紹介"
								placeholder="Your bio"
								value={userProfile.bio}
								onChange={(e) => {
									return updateUserProfile({ bio: e.currentTarget.value });
								}}
								maxLength={160}
							/>
						</Col>
						<Col style={{ marginTop: 5 }}>
							<TextInput
								label="場所"
								placeholder="Your location"
								value={userProfile.location}
								onChange={(e) => {
									return updateUserProfile({ location: e.currentTarget.value });
								}}
							/>
						</Col>
						<Col style={{ marginTop: 5 }}>
							<TextInput
								label="ウェブサイト"
								placeholder="Your website"
								value={userProfile.website}
								onChange={(e) => {
									return updateUserProfile({ website: e.currentTarget.value });
								}}
							/>
						</Col>
					</Grid>
					<Group position="right" style={{ marginTop: 15 }}>
						<Button
							type="submit"
							color="blue"
							onClick={() => {
								return postNewUser(userProfile);
							}}
						>
							送信
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
}
