import { Box, Button, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { userPostsQuery } from "@/entities/post";
import { ProfileHeader, ProfileStats, useCurrentUser, userProfileQuery } from "@/entities/user";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { FollowButton } from "@/components/FollowButton/FollowButton";
import { Post } from "@/components/Post/Post";
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
	component: ProfilePage,
});

function ProfilePage() {
	const { userId } = Route.useParams();
	const currentUser = useCurrentUser();
	const { data: profile } = useSuspenseQuery(userProfileQuery(userId));
	const { data: posts } = useSuspenseQuery(userPostsQuery(userId));
	const [isEditProfileOpened, editProfileModal] = useDisclosure(false);
	const isCurrentUser = currentUser.id === userId;

	if (!profile) {
		return null;
	}

	return (
		<>
			<Box
				p="xl"
				w="100%"
				style={{
					borderBottom: "1px solid #E9ECEF",
				}}
			>
				<ProfileHeader user={profile} />
				<ProfileStats user={profile} />
				<Center>
					{isCurrentUser ? (
						<Button variant="outline" color="dark" onClick={editProfileModal.open}>
							プロフィールを編集
						</Button>
					) : (
						<FollowButton userId={userId} />
					)}
				</Center>
			</Box>
			{posts.map((post) => {
				return <Post key={post.id} post={post} currentUserId={currentUser.id} />;
			})}
			{isCurrentUser && (
				<EditProfileModal
					currentUser={currentUser}
					opened={isEditProfileOpened}
					onClose={editProfileModal.close}
				/>
			)}
		</>
	);
}
