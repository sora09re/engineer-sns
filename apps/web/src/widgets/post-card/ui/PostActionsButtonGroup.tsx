import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconMessageCircle2, IconThumbUp } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { useToggleLike } from "../api/useToggleLike";
import type { PostType } from "@engineer-sns/shared";

import { notifyMutation } from "@/shared/lib";

interface PostActionsButtonGroupProps {
	post: PostType;
}

export const PostActionsButtonGroup = ({ post }: PostActionsButtonGroupProps) => {
	const { hovered: hoveredComments, ref: refComments } = useHover();
	const { hovered: hoveredLikes, ref: refLikes } = useHover();
	const toggleLike = useToggleLike();

	const isLikedByCurrentUser = toggleLike.isPending ? toggleLike.variables.like : post.is_liked;
	const likeCount =
		post.like_count + (isLikedByCurrentUser === post.is_liked ? 0 : isLikedByCurrentUser ? 1 : -1);

	const commentsColor = hoveredComments ? "#228be6" : "black";
	const likesColor = hoveredLikes ? "#37B24D" : isLikedByCurrentUser ? "#37B24D" : "black";

	const handleLikeClick = () => {
		if (toggleLike.isPending) {
			return;
		}
		const variables = { like: !isLikedByCurrentUser, postId: post.id };
		void notifyMutation(toggleLike, variables, { label: "いいね", report: "failure" });
	};

	return (
		<Group align="center" gap={40}>
			<UnstyledButton>
				<Link
					to="/posts/$postId"
					params={{ postId: post.id }}
					aria-label="コメント"
					style={{ textDecoration: "none" }}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<Tooltip label="コメント" position="bottom" withArrow>
						<Group ref={refComments} align="center" gap="sm">
							<IconMessageCircle2 size="1.2rem" color={commentsColor} />
							<Text c={commentsColor}>{post.comment_count}</Text>
						</Group>
					</Tooltip>
				</Link>
			</UnstyledButton>
			<UnstyledButton
				aria-label={!isLikedByCurrentUser ? "いいね" : "いいねを取り消す"}
				aria-pressed={isLikedByCurrentUser}
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
					<Group ref={refLikes} align="center" gap="sm">
						<IconThumbUp size="1.2rem" color={likesColor} />
						<Text c={likesColor}>{likeCount}</Text>
					</Group>
				</Tooltip>
			</UnstyledButton>
		</Group>
	);
};
