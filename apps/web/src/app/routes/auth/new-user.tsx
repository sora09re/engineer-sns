import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/entities/account";
import { currentUserQuery } from "@/entities/user";
import { NewUserForm } from "@/pages/new-user";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/auth/new-user")({
	head: () => pageTitle("ユーザー新規登録"),
	beforeLoad: async ({ context }) => {
		const account = await getSignedInAccount();
		if (!account) {
			throw redirect({ to: "/auth/signin" });
		}
		if (await context.queryClient.ensureQueryData(currentUserQuery())) {
			throw redirect({ to: "/" });
		}
		return { account };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { account } = Route.useRouteContext();
	return <NewUserForm account={account} />;
}
