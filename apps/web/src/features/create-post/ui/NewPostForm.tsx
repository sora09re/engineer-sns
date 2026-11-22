import { Box, Button, Space, Textarea } from "@mantine/core";
import { useState } from "react";
import { isValidPostContent } from "@engineer-sns/shared/rules";

import { notifyMutation } from "@/shared/lib";

import { useCreatePost } from "../api/useCreatePost";

interface NewPostFormProps {
	onPosted?: () => void;
}

export const NewPostForm = ({ onPosted }: NewPostFormProps) => {
	const [postContent, setPostContent] = useState("");
	const createPost = useCreatePost();

	const fetchPost = async () => {
		if (await notifyMutation(createPost, postContent, { label: "投稿" })) {
			setPostContent("");
			onPosted?.();
		}
	};

	return (
		<Box p="md" style={{ borderBottom: "1px solid #E9ECEF" }}>
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
				disabled={!isValidPostContent(postContent)}
			>
				投稿する
			</Button>
		</Box>
	);
};
