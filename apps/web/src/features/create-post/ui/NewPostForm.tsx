import { Box, Button, Space, Textarea } from "@mantine/core";
import { useState } from "react";
import { isValidPostContent } from "@engineer-sns/shared/rules";

import { notifyMutation, useIsMounted } from "@/shared/lib";

import { useCreatePost } from "../api/useCreatePost";

const wordings = {
	post: {
		label: "投稿内容",
		placeholder: "今どうしてる？",
		submit: "投稿する",
		notice: "投稿",
	},
	comment: {
		label: undefined,
		placeholder: "コメント",
		submit: "コメントする",
		notice: "コメント",
	},
} as const;

interface NewPostFormProps {
	parentPostId?: string;
	onPosted?: () => void;
}

export const NewPostForm = ({ parentPostId, onPosted }: NewPostFormProps) => {
	const [content, setContent] = useState("");
	const createPost = useCreatePost();
	const isMounted = useIsMounted();
	const wording = parentPostId === undefined ? wordings.post : wordings.comment;

	const submit = async () => {
		const variables = { content, parentPostId };
		const posted = await notifyMutation(createPost, variables, { label: wording.notice });
		if (posted && isMounted()) {
			setContent("");
			onPosted?.();
		}
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
