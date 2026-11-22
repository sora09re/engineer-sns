import { Box, Button, Space, Textarea } from "@mantine/core";
import { useState } from "react";
import { isValidPostContent } from "@engineer-sns/shared/rules";

import { notifyMutation } from "@/shared/lib";

import { useCreateComment } from "../api/useCreateComment";

interface CommentFormProps {
	postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
	const [commentContent, setCommentContent] = useState("");
	const createComment = useCreateComment();

	const fetchComment = async () => {
		const variables = { content: commentContent, postId };
		if (await notifyMutation(createComment, variables, { label: "コメント" })) {
			setCommentContent("");
		}
	};

	return (
		<Box p="md" style={{ borderBottom: "1px solid #E9ECEF" }}>
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
				disabled={!isValidPostContent(commentContent)}
			>
				コメントする
			</Button>
		</Box>
	);
};
