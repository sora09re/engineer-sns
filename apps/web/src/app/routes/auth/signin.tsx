import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/entities/account";
import { SignInPage } from "@/pages/sign-in";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/auth/signin")({
	head: () => pageTitle("ログイン"),
	beforeLoad: async () => {
		if (await getSignedInAccount()) {
			throw redirect({ to: "/" });
		}
	},
	component: SignInPage,
});
