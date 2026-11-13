import { Avatar, Box, Group, Space, Text } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";

import { ContentPart, parseContent } from "@/components/ContentPart/ContentPart";
import { DateFormat } from "@/components/DateFormat/DateFormat";
import { PostActionMenu } from "@/components/PostActionMenu/PostActionMenu";
import { PostActionsButtonGroup } from "@/components/PostActionsButtonGroup/PostActionsButtonGroup";
import type { PostType } from "@/types/post";

interface PostProps {
	currentUserId: string;
	post: PostType;
}

export const Post = ({ currentUserId, post }: PostProps) => {
	const parsedContent = parseContent(post.content);
	const navigate = useNavigate();
	const isPostByCurrentUser = post.user_id === currentUserId;

	if (!post) {
		return null;
	}

	return (
		<Box
			key={post.id}
			p="md"
			w="100%"
			sx={{
				borderBottom: "1px solid #E9ECEF",
				cursor: "pointer",
				position: "relative",
			}}
			onClick={() => {
				return navigate({ to: "/posts/$postId", params: { postId: post.id } });
			}}
		>
			{isPostByCurrentUser ? <PostActionMenu postId={post.id} /> : <></>}
			<Group align="start">
				<Box>
					<Link
						to="/profile/$userId"
						params={{ userId: post.user_id }}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<Avatar src={post.users.profile_image_url} alt="投稿したユーザーのプロフィール画像" />
					</Link>
				</Box>
				<Box>
					<Group spacing="xs">
						<Link
							to="/profile/$userId"
							params={{ userId: post.user_id }}
							style={{ textDecoration: "none" }}
							onClick={(event) => {
								event.stopPropagation();
							}}
						>
							<Text fw={700} color="black">
								{post.users.name}
							</Text>
						</Link>
						<Text color="dimmed">@{post.users.username}</Text>
						<Text color="dimmed">
							<DateFormat props={post.created_at} />
						</Text>
					</Group>
					{parsedContent.map((part, index) => {
						// biome-ignore lint/suspicious/noArrayIndexKey:
						return <ContentPart key={index} part={part} />;
					})}
					<Space h="md" />
					<PostActionsButtonGroup currentUserId={currentUserId} post={post} />
				</Box>
			</Group>
		</Box>
	);
};
