import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSignedInAccount } from "@/entities/account";
import { CallbackErrorPage } from "@/pages/auth-callback";

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
	component: RouteComponent,
});

function RouteComponent() {
	const { error_description } = Route.useSearch();
	return <CallbackErrorPage errorDescription={error_description} />;
}
