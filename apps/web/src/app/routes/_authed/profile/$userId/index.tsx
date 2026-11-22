import { createFileRoute } from "@tanstack/react-router";

import { userPostsQuery } from "@/entities/post";
import { userProfileDetail } from "@/entities/user";
import { ProfilePage } from "@/pages/profile";
import { pageTitle } from "@/shared/lib";

export const Route = createFileRoute("/_authed/profile/$userId/")({
	head: () => pageTitle("プロフィール"),
	loader: async ({ context, params }) => {
		await Promise.all([
			userProfileDetail.load(context.queryClient, params.userId),
			context.queryClient.ensureQueryData(userPostsQuery(params.userId)),
		]);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <ProfilePage userId={userId} />;
}
