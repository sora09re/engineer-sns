import { createFileRoute } from "@tanstack/react-router";

import { followeesQuery, followersQuery } from "@/entities/user";
import { FollowsPage } from "@/pages/follows";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/profile/$userId/follows")({
	head: () => pageTitle("フォロー"),
	loader: ({ context, params }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(followersQuery(params.userId)),
			context.queryClient.ensureQueryData(followeesQuery(params.userId)),
		]);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <FollowsPage userId={userId} />;
}
