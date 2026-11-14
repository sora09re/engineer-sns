import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useCreatePost } from "@/hooks/mutations";

interface NewPostFormProps {
	/** 投稿に成功したとき（モーダルから使うときに閉じるため） */
	onPosted?: () => void;
}

export const NewPostForm = ({ onPosted }: NewPostFormProps) => {
	const [postContent, setPostContent] = useState("");
	const createPost = useCreatePost();

	const fetchPost = () => {
		notifications.show({
			id: "post-data",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "投稿中...",
			withCloseButton: false,
		});

		createPost.mutate(postContent, {
			onSuccess: () => {
				setPostContent("");
				onPosted?.();
				notifications.update({
					id: "post-data",
					autoClose: 2000,
					color: "green",
					icon: <IconCheck size="1rem" />,
					message: "投稿に成功しました！",
					title: "成功",
				});
			},
			onError: () => {
				notifications.update({
					id: "post-data",
					autoClose: 2000,
					color: "red",
					icon: <IconX size="1rem" />,
					message: "投稿に失敗しました。",
					title: "エラー",
				});
			},
		});
	};

	return (
		<Box p="md" sx={{ borderBottom: "1px solid #E9ECEF" }}>
			<Textarea
				placeholder="今どうしてる？"
				label="投稿内容"
				autosize
				minRows={5}
				maxRows={20}
				value={postContent}
				onChange={(e) => {
					return setPostContent(e.currentTarget.value);
				}}
			/>
			<Space h="md" />
			<Button
				fullWidth
				onClick={fetchPost}
				loading={createPost.isPending}
				disabled={postContent.trim() === ""}
			>
				投稿する
			</Button>
		</Box>
	);
};
