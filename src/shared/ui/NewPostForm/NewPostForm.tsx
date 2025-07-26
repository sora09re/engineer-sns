import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

import { useGetPostsForUser } from "@/shared/api";
import { useGetTimelinePosts } from "@/shared/api";
import { useModal } from "@/shared/model";
import type { User } from "@/shared/types/user";
import { baseURL } from "@/shared/utils/baseUrl";

interface NewPostFormProps {
	currentUser: Pick<User, "id">;
}

export const NewPostForm = ({ currentUser }: NewPostFormProps) => {
	const [postContent, setPostContent] = useState("");
	const [, setIsVisiblePostModal] = useModal("post");
	const { mutate: getTimelinePostsMutate } = useGetTimelinePosts(
		currentUser.id,
	);
	const { mutate: getPostsForUserMutate } = useGetPostsForUser(currentUser.id);

	const fetchPost = async () => {
		notifications.show({
			id: "post-data",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "投稿中...",
			withCloseButton: false,
		});

		try {
			await axios.post(`${baseURL}/api/posts`, {
				currentUserId: currentUser.id,
				postContent: postContent,
			});
			setPostContent("");
			setIsVisiblePostModal(false);
			getTimelinePostsMutate();
			getPostsForUserMutate();
			notifications.update({
				id: "post-data",
				autoClose: 2000,
				color: "green",
				icon: <IconCheck size="1rem" />,
				message: "投稿に成功しました！",
				title: "成功",
			});
		} catch (_error) {
			notifications.update({
				id: "post-data",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "投稿に失敗しました。",
				title: "エラー",
			});
		}
	};

	return (
		<Box p="md" sx={{ borderBottom: "1px solid #E9ECEF" }}>
			<Textarea
				placeholder="今どうしてる？"
				label="投稿内容"
				autosize
				minRows={5}
				maxRows={20}
				value={postContent || ""}
				onChange={(e) => {
					return setPostContent(e.currentTarget.value);
				}}
			/>
			<Space h="md" />
			<Button
				fullWidth
				onClick={fetchPost}
				disabled={postContent ? postContent.trim() === "" : true}
			>
				投稿する
			</Button>
		</Box>
	);
};
