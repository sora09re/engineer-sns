import { Box, Container, Paper, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";

import { UserValuesForm, type UserValuesSubmission } from "@/features/user-values-form";
import { useCreateCurrentUser } from "../api/useCreateCurrentUser";
import { notifyMutation } from "@/shared/lib";
import type { Account } from "@engineer-sns/shared";

interface NewUserFormProps {
	account: Account;
}

export const NewUserForm = ({ account }: NewUserFormProps) => {
	const navigate = useNavigate();
	const createUser = useCreateCurrentUser();

	const handleSubmit = async (submission: UserValuesSubmission) => {
		const notice = { label: "ユーザー登録", report: "failure" } as const;
		if (await notifyMutation(createUser, submission, notice)) {
			await navigate({ to: "/" });
		}
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
						onSubmit={(submission) => {
							void handleSubmit(submission);
						}}
					/>
				</Box>
			</Paper>
		</Container>
	);
};
