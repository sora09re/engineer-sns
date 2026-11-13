import { Button, Center, Stack, Text } from "@mantine/core";
import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";

export const ErrorView = ({ error, reset }: ErrorComponentProps) => {
	const router = useRouter();

	return (
		<Center style={{ height: "100vh" }}>
			<Stack align="center">
				<Text>エラーが発生しました。</Text>
				<Text size="sm" color="dimmed">
					{error instanceof Error ? error.message : String(error)}
				</Text>
				<Button
					variant="outline"
					onClick={() => {
						reset();
						void router.invalidate();
					}}
				>
					再読み込み
				</Button>
			</Stack>
		</Center>
	);
};
