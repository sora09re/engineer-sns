import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/entities/account";
import { currentUserQuery } from "@/entities/user";
import { NewUserForm } from "@/components/NewUserForm/NewUserForm";
import { pageTitle } from "@/shared/lib";

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
