import { Box, Button, Paper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSignedInAccount, signInWithGitHub } from "@/api/session";
import { pageTitle } from "@/lib/title";

export const Route = createFileRoute("/auth/signin")({
	head: () => pageTitle("ログイン"),
	beforeLoad: async () => {
		if (await getSignedInAccount()) {
			throw redirect({ to: "/" });
		}
	},
	component: SigninPage,
});

function SigninPage() {
	const handleSignIn = async () => {
		try {
			await signInWithGitHub();
		} catch {
			notifications.show({
				id: "signin-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "ログインに失敗しました。",
				title: "エラー",
			});
		}
	};

	return (
		<Box
			sx={{
				alignItems: "center",
				display: "flex",
				height: "100vh",
				justifyContent: "center",
			}}
		>
			<Paper p="xl" sx={{ maxWidth: 600 }}>
				<Title order={2} align="center" sx={{ marginBottom: 40 }}>
					ログインページ
				</Title>
				<Box sx={{ marginBottom: 40 }}>
					<Text>このアプリはエンジニア向けのSNSアプリです。</Text>
					<Text>そのため、ログイン方法はGithub でのログインのみになります。</Text>
				</Box>
				<Text sx={{ marginBottom: 20 }}>
					採用担当の方は「Githubでログイン」ボタン押下後に表示されるGithubログイン画面にて下記の情報をご入力ください。
				</Text>
				<Text sx={{ marginBottom: 20 }}>
					<Text>【ログイン情報 (採用担当者用)】</Text>
					<Text>ユーザー名：Engineer-1234</Text>
					<Text>パスワード：EngineerTestUser1234</Text>
				</Text>
				<Button fullWidth variant="outline" color="dark" onClick={handleSignIn}>
					Githubでログイン
				</Button>
			</Paper>
		</Box>
	);
}
