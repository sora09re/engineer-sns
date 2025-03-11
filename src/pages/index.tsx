import { Box, Center, Flex, Loader } from "@mantine/core";
import type { NextPage } from "next";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { PostsList } from "@/components/PostsList/PostsList";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useGetTimelinePosts } from "@/hooks/useGetTimelinePosts";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

const Index: NextPage = () => {
	const {
		data: currentUser,
		error: getCurrentUserError,
		isLoading: getCurrentUserIsLoading,
	} = useGetCurrentUser();

	const {
		data: posts,
		error: getTimelinePostsError,
		isLoading: getTimelinePostsIsLoading,
	} = useGetTimelinePosts(currentUser?.id);

	if (!currentUser || getCurrentUserIsLoading) {
		return <CenteredLoader />;
	}

	if (getCurrentUserError || getTimelinePostsError) {
		return <div>エラーが発生しました。再度、更新を行ってください。</div>;
	}

	return (
		<Flex>
			<Sidebar currentUser={currentUser} />
			<Box w="100%" ml={sideBarWidthBase}>
				<NewPostForm currentUser={currentUser} />
				{getTimelinePostsIsLoading ? (
					<Center mt={300}>
						<Loader />
					</Center>
				) : (
					<PostsList posts={posts} currentUserId={currentUser.id} />
				)}
			</Box>
		</Flex>
	);
};

export default Index;
