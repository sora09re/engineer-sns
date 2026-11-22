import { Avatar, Box, Group, Space, Text } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";

import { ContentPart, parseContent } from "@/entities/post";
import { DateFormat } from "@/shared/ui";
import { PostActionMenu } from "./PostActionMenu";
import { PostActionsButtonGroup } from "./PostActionsButtonGroup";
import type { PostType } from "@engineer-sns/shared";

interface PostProps {
	post: PostType;
	onDeleted?: () => void;
}

export const Post = ({ post, onDeleted }: PostProps) => {
	const parsedContent = parseContent(post.content);
	const navigate = useNavigate();

	return (
		<Box
			component="article"
			key={post.id}
			p="md"
			w="100%"
			style={{
				borderBottom: "1px solid #E9ECEF",
				cursor: "pointer",
				position: "relative",
			}}
			onClick={() => {
				return navigate({ to: "/posts/$postId", params: { postId: post.id } });
			}}
		>
			{post.can_delete ? <PostActionMenu postId={post.id} onDeleted={onDeleted} /> : <></>}
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
					<Group gap="xs">
						<Link
							to="/profile/$userId"
							params={{ userId: post.user_id }}
							style={{ textDecoration: "none" }}
							onClick={(event) => {
								event.stopPropagation();
							}}
						>
							<Text fw={700} c="black">
								{post.users.name}
							</Text>
						</Link>
						<Text c="dimmed">@{post.users.username}</Text>
						<Text c="dimmed">
							<DateFormat props={post.created_at} />
						</Text>
					</Group>
					{parsedContent.map((part) => {
						return <ContentPart key={part.offset} part={part} />;
					})}
					<Space h="md" />
					<PostActionsButtonGroup post={post} />
				</Box>
			</Group>
		</Box>
	);
};
