"use client";

import { Box, Button, Paper, Text, Title } from "@mantine/core";
import { signIn } from "next-auth/react";

export function SigninPageClient() {
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
					<Text>
						そのため、ログイン方法はGithub でのログインのみになります。
					</Text>
				</Box>
				<Text sx={{ marginBottom: 20 }}>
					採用担当の方は「Githubでログイン」ボタン押下後に表示されるGithubログイン画面にて下記の情報をご入力ください。
				</Text>
				<Text sx={{ marginBottom: 20 }}>
					<Text>【ログイン情報 (採用担当者用)】</Text>
					<Text>ユーザー名：Engineer-1234</Text>
					<Text>パスワード：EngineerTestUser1234</Text>
				</Text>
				<Button
					fullWidth
					variant="outline"
					color="dark"
					onClick={() => {
						return signIn("github");
					}}
				>
					Githubでログイン
				</Button>
			</Paper>
		</Box>
	);
}
