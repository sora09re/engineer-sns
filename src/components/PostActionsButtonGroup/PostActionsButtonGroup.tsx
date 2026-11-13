import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMessageCircle2, IconThumbUp, IconX } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { useToggleLike } from "@/hooks/mutations";
import type { PostType } from "@/types/post";

interface PostActionsButtonGroupProps {
	currentUserId: string;
	post: PostType;
}

export const PostActionsButtonGroup = ({ currentUserId, post }: PostActionsButtonGroupProps) => {
	const { hovered: hoveredComments, ref: refComments } = useHover();
	const { hovered: hoveredLikes, ref: refLikes } = useHover();
	const toggleLike = useToggleLike();

	const isLikedOnServer = post.likes.some((like) => {
		return like.user_id === currentUserId;
	});
	// 送信中は押した結果を先に表示する（再取得が終わるまで pending のまま）
	const isLikedByCurrentUser = toggleLike.isPending ? toggleLike.variables.like : isLikedOnServer;
	const likeCount =
		post.likes.length +
		(isLikedByCurrentUser === isLikedOnServer ? 0 : isLikedByCurrentUser ? 1 : -1);

	const commentsColor = hoveredComments ? "#228be6" : "black";
	const likesColor = hoveredLikes ? "#37B24D" : isLikedByCurrentUser ? "#37B24D" : "black";

	const handleLikeClick = () => {
		if (toggleLike.isPending) {
			return;
		}
		toggleLike.mutate(
			{ like: !isLikedByCurrentUser, postId: post.id },
			{
				onError: () => {
					notifications.show({
						id: "click-likes",
						autoClose: 2000,
						color: "red",
						icon: <IconX size="1rem" />,
						message: "いいねに失敗しました。",
						title: "エラー",
					});
				},
			},
		);
	};

	return (
		<Group align="center" spacing={40}>
			<UnstyledButton>
				<Link
					to="/posts/$postId"
					params={{ postId: post.id }}
					style={{ textDecoration: "none" }}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<Tooltip label="コメント" position="bottom" withArrow>
						<Group ref={refComments} align="center" spacing="sm">
							<IconMessageCircle2 size="1.2rem" color={commentsColor} />
							<Text color={commentsColor}>{post.comment_count}</Text>
						</Group>
					</Tooltip>
				</Link>
			</UnstyledButton>
			<UnstyledButton
				onClick={(event) => {
					event.stopPropagation();
					handleLikeClick();
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
