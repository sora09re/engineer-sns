import { Box, Flex } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/entities/account";
import { currentUserQuery } from "@/entities/user";
import { Sidebar, sideBarWidthBase } from "@/widgets/sidebar";

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
			<Box component="main" w="100%" ml={sideBarWidthBase}>
				<Outlet />
			</Box>
		</Flex>
	);
}
