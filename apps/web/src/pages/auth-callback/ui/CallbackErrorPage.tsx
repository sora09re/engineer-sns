import { Button, Center, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

interface CallbackErrorPageProps {
	errorDescription?: string;
}

export const CallbackErrorPage = ({ errorDescription }: CallbackErrorPageProps) => {
	return (
		<Center style={{ height: "100vh" }}>
			<Stack align="center">
				<Text>ログインに失敗しました。</Text>
				{errorDescription && (
					<Text size="sm" c="dimmed">
						{errorDescription}
					</Text>
				)}
				<Button component={Link} to="/auth/signin" variant="outline">
					ログインページへ戻る
				</Button>
			</Stack>
		</Center>
	);
};
