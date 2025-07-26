import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMessageCircle2, IconThumbUp, IconX } from "@tabler/icons";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

import type { PostType } from "@/shared/types/post";
import { baseURL } from "@/utils/baseUrl";

interface PostActionsButtonGroupProps {
	currentUserId: string;
	post: PostType;
}

export const PostActionsButtonGroup = ({
	currentUserId,
	post,
}: PostActionsButtonGroupProps) => {
	const { hovered: hoveredComments, ref: refComments } = useHover();
	const { hovered: hoveredLikes, ref: refLikes } = useHover();

	const isLikedByCurrentUserInitialValue = post.likes.some((like) => {
		return like.post_id === post.id && like.user_id === currentUserId;
	});
	const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(
		isLikedByCurrentUserInitialValue,
	);
	const [likeCount, setLikeCount] = useState(post.likes.length);

	const commentsColor = hoveredComments ? "#228be6" : "black";
	const likesColor = hoveredLikes
		? "#37B24D"
		: isLikedByCurrentUser
			? "#37B24D"
			: "black";

	const handleLikeClick = async (postId: string) => {
		const newLikeStatus = !isLikedByCurrentUser;
		setIsLikedByCurrentUser(newLikeStatus);
		setLikeCount(likeCount + (newLikeStatus ? 1 : -1));

		try {
			const endpoint = `${baseURL}/api/posts/${postId}/likes`;
			if (newLikeStatus) {
				await axios.post(endpoint, { currentUserId });
			} else {
				await axios.delete(endpoint, {
					params: { currentUserId },
				});
			}
		} catch (_error) {
			notifications.show({
				id: "click-likes",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "いいねに失敗しました。",
				title: "エラー",
			});
		}
	};

	return (
		<Group align="center" spacing={40}>
			<UnstyledButton>
				<Link href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
					<Tooltip label="コメント" position="bottom" withArrow>
						<Group ref={refComments} align="center" spacing="sm">
							<IconMessageCircle2 size="1.2rem" color={commentsColor} />
							<Text color={commentsColor}>
								{post.comments ? post.comments.length : 0}
							</Text>
						</Group>
					</Tooltip>
				</Link>
			</UnstyledButton>
			<UnstyledButton
				onClick={(event) => {
					event.stopPropagation();
					return handleLikeClick(post.id);
				}}
			>
				<Tooltip
					label={!isLikedByCurrentUser ? "いいね" : "いいねを取り消す"}
					position="bottom"
					withArrow
				>
					<Group ref={refLikes} align="center" spacing="sm">
						<IconThumbUp size="1.2rem" color={likesColor} />
						<Text color={likesColor}>{likeCount}</Text>
					</Group>
				</Tooltip>
			</UnstyledButton>
		</Group>
	);
};
