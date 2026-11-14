import { createFileRoute, redirect } from "@tanstack/react-router";

import { currentUserQuery } from "@/api/queries";
import { getSignedInAccount } from "@/api/session";
import { NewUserForm } from "@/components/NewUserForm/NewUserForm";
import { pageTitle } from "@/lib/title";

/** 新規ユーザー登録: ユーザーを持たないアカウントだけが表示できる */
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
	component: NewUserPage,
});

function NewUserPage() {
	const { account } = Route.useRouteContext();
	return <NewUserForm account={account} />;
}
