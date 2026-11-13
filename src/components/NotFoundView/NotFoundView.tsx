import { Button, Center, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";

export const NotFoundView = () => {
	return (
		<Center style={{ height: "100vh" }}>
			<Stack align="center">
				<Text>ページが見つかりません。</Text>
				<Button component={Link} to="/" variant="outline">
					ホームへ戻る
				</Button>
			</Stack>
		</Center>
	);
};
