import { Box, Button, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";

import { FollowButton } from "@/features/toggle-follow";
import { userPostsQuery } from "@/entities/post";
import { ProfileHeader, ProfileStats, userProfileDetail, useCurrentUser } from "@/entities/user";
import { Post } from "@/widgets/post-card";

import { EditProfileModal } from "./EditProfileModal";

interface ProfilePageProps {
	userId: string;
}

export const ProfilePage = ({ userId }: ProfilePageProps) => {
	const currentUser = useCurrentUser();
	const profile = userProfileDetail.useData(userId);
	const { data: posts } = useSuspenseQuery(userPostsQuery(userId));
	const [isEditProfileOpened, editProfileModal] = useDisclosure(false);
	const isCurrentUser = currentUser.id === userId;

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
						<FollowButton user={profile} />
					)}
				</Center>
			</Box>
			{posts.map((post) => {
				return <Post key={post.id} post={post} />;
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
};
