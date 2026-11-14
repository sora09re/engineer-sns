import { Box, Button, Space, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useCreateComment } from "@/hooks/mutations";

interface CommentFormProps {
	postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
	const [commentContent, setCommentContent] = useState("");
	const createComment = useCreateComment();

	const fetchComment = () => {
		notifications.show({
			id: "fetchComment",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "コメント中...",
			withCloseButton: false,
		});

		createComment.mutate(
			{ content: commentContent, postId },
			{
				onSuccess: () => {
					setCommentContent("");
					notifications.update({
						id: "fetchComment",
						autoClose: 2000,
						color: "green",
						icon: <IconCheck size="1rem" />,
						message: "コメントに成功しました！",
						title: "成功",
					});
				},
				onError: () => {
					notifications.update({
						id: "fetchComment",
						autoClose: 2000,
						color: "red",
						icon: <IconX size="1rem" />,
						message: "コメントに失敗しました。",
						title: "エラー",
					});
				},
			},
		);
	};

	return (
		<Box p="md" sx={{ borderBottom: "1px solid #E9ECEF" }}>
			<Textarea
				placeholder="コメント"
				autosize
				minRows={5}
				maxRows={20}
				value={commentContent}
				onChange={(e) => {
					return setCommentContent(e.currentTarget.value);
				}}
			/>
			<Space h="md" />
			<Button
				fullWidth
				onClick={fetchComment}
				loading={createComment.isPending}
				disabled={commentContent.trim() === ""}
			>
				コメントする
			</Button>
		</Box>
	);
};
