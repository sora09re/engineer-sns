import { Box, Flex } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { currentUserQuery } from "@/api/queries";
import { getSignedInAccount } from "@/api/session";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

/**
 * ログイン必須のページをまとめるレイアウト。
 * アカウントがなければログインへ、ユーザーがなければ新規ユーザー登録へ誘導する。
 */
export const Route = createFileRoute("/_authed")({
	beforeLoad: async ({ context }) => {
		const account = await getSignedInAccount();
		if (!account) {
			throw redirect({ to: "/auth/signin" });
		}

		const currentUser = await context.queryClient.ensureQueryData(currentUserQuery());
		if (!currentUser) {
			throw redirect({ to: "/auth/new-user" });
		}
	},
	component: AuthedLayout,
});

function AuthedLayout() {
	return (
		<Flex>
			<Sidebar />
			<Box w="100%" ml={sideBarWidthBase}>
				<Outlet />
			</Box>
		</Flex>
	);
}
