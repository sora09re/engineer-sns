import { Button, Center, Stack, Text } from "@mantine/core";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/api/session";

/**
 * GitHub OAuth のコールバック。
 * supabase-js がクライアント初期化時に URL の code をセッションに交換するので、
 * それが終わってからトップへ送る（ユーザーの有無は /_authed が判定する）。
 */
export const Route = createFileRoute("/auth/callback")({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			error_description:
				typeof search.error_description === "string" ? search.error_description : undefined,
		};
	},
	beforeLoad: async () => {
		if (await getSignedInAccount()) {
			throw redirect({ to: "/", replace: true });
		}
	},
	component: CallbackErrorPage,
});

function CallbackErrorPage() {
	const { error_description } = Route.useSearch();

	return (
		<Center style={{ height: "100vh" }}>
			<Stack align="center">
				<Text>ログインに失敗しました。</Text>
				{error_description && (
					<Text size="sm" color="dimmed">
						{error_description}
					</Text>
				)}
				<Button component={Link} to="/auth/signin" variant="outline">
					ログインページへ戻る
				</Button>
			</Stack>
		</Center>
	);
}
