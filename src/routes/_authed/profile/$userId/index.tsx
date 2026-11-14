import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { userPostsQuery, userProfileQuery } from "@/api/queries";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostsList } from "@/components/PostsList/PostsList";
import { Profile } from "@/components/Profile/Profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { pageTitle } from "@/lib/title";

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
	component: ProfilePage,
});

function ProfilePage() {
	const { userId } = Route.useParams();
	const currentUser = useCurrentUser();
	const { data: profile } = useSuspenseQuery(userProfileQuery(userId));
	const { data: posts } = useSuspenseQuery(userPostsQuery(userId));

	if (!profile) {
		return null;
	}

	return (
		<>
			<Profile user={profile} currentUserId={currentUser.id} />
			<PostsList posts={posts} currentUserId={currentUser.id} />
			{currentUser.id === userId && <EditProfileModal currentUser={currentUser} />}
		</>
	);
}
