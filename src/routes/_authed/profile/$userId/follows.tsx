import { createFileRoute } from "@tanstack/react-router";

import { followeesQuery, followersQuery } from "@/api/queries";
import { Follows } from "@/components/Follows/Follows";
import { pageTitle } from "@/lib/title";

export const Route = createFileRoute("/_authed/profile/$userId/follows")({
	head: () => pageTitle("フォロー"),
	loader: ({ context, params }) => {
		return Promise.all([
			context.queryClient.ensureQueryData(followersQuery(params.userId)),
			context.queryClient.ensureQueryData(followeesQuery(params.userId)),
		]);
	},
	component: FollowsPage,
});

function FollowsPage() {
	const { userId } = Route.useParams();
	return <Follows userId={userId} />;
}
