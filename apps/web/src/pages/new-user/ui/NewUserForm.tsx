import { Box, Container, Paper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { UserValuesForm, type UserValuesSubmission } from "@/features/user-values-form";
import { useCreateCurrentUser } from "../api/useCreateCurrentUser";
import type { Account } from "@engineer-sns/shared";

interface NewUserFormProps {
	account: Account;
}

export const NewUserForm = ({ account }: NewUserFormProps) => {
	const navigate = useNavigate();
	const createUser = useCreateCurrentUser();

	const handleSubmit = (submission: UserValuesSubmission) => {
		createUser.mutate(submission, {
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
		});
	};

	return (
		<Container size={400} p={20}>
			<Paper p="md">
				<Title order={4} ta="center">
					ユーザー新規登録
				</Title>
				<Box style={{ marginTop: 15 }}>
					<UserValuesForm
						initialValues={{
							bio: "",
							email: account.email ?? "",
							location: "",
							name: account.name ?? "",
							profile_image_url: account.avatarUrl ?? "",
							username: "",
							website: "",
						}}
						withEmail
						submitLabel="送信"
						isSubmitting={createUser.isPending}
						onSubmit={handleSubmit}
					/>
				</Box>
			</Paper>
		</Container>
	);
};
