import { createFileRoute, notFound } from "@tanstack/react-router";

import { userPostsQuery } from "@/entities/post";
import { userProfileQuery } from "@/entities/user";
import { ProfilePage } from "@/pages/profile";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/profile/$userId/")({
	head: () => pageTitle("プロフィール"),
	loader: async ({ context, params }) => {
		const [profile] = await Promise.all([
			context.queryClient.ensureQueryData(userProfileQuery(params.userId)),
			context.queryClient.ensureQueryData(userPostsQuery(params.userId)),
		]);
		if (!profile) {
			throw notFound();
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <ProfilePage userId={userId} />;
}
