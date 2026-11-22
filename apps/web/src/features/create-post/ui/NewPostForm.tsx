import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { isValidPostContent } from "@engineer-sns/shared/rules";

import { useCreatePost } from "../api/useCreatePost";

const wordings = {
	post: {
		label: "投稿内容",
		placeholder: "今どうしてる？",
		submit: "投稿する",
		notificationId: "post-data",
		pending: "投稿中...",
		succeeded: "投稿に成功しました！",
		failed: "投稿に失敗しました。",
	},
	comment: {
		label: undefined,
		placeholder: "コメント",
		submit: "コメントする",
		notificationId: "fetchComment",
		pending: "コメント中...",
		succeeded: "コメントに成功しました！",
		failed: "コメントに失敗しました。",
	},
} as const;

interface NewPostFormProps {
	parentPostId?: string;
	onPosted?: () => void;
}

export const NewPostForm = ({ parentPostId, onPosted }: NewPostFormProps) => {
	const [content, setContent] = useState("");
	const createPost = useCreatePost();
	const wording = parentPostId === undefined ? wordings.post : wordings.comment;

	const submit = () => {
		notifications.show({
			id: wording.notificationId,
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: wording.pending,
			withCloseButton: false,
		});

		createPost.mutate(
			{ content, parentPostId },
			{
				onSuccess: () => {
					setContent("");
					onPosted?.();
					notifications.update({
						id: wording.notificationId,
						autoClose: 2000,
						color: "green",
						icon: <IconCheck size="1rem" />,
						message: wording.succeeded,
						title: "成功",
					});
				},
				onError: () => {
					notifications.update({
						id: wording.notificationId,
						autoClose: 2000,
						color: "red",
						icon: <IconX size="1rem" />,
						message: wording.failed,
						title: "エラー",
					});
				},
			},
		);
	};

	return (
		<Box p="md" style={{ borderBottom: "1px solid #E9ECEF" }}>
			<Textarea
				placeholder={wording.placeholder}
				label={wording.label}
				autosize
				minRows={5}
				maxRows={20}
				value={content}
				onChange={(e) => {
					return setContent(e.currentTarget.value);
				}}
			/>
			<Space h="md" />
			<Button
				fullWidth
				onClick={submit}
				loading={createPost.isPending}
				disabled={!isValidPostContent(content)}
			>
				{wording.submit}
			</Button>
		</Box>
	);
};
