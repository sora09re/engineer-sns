import { Avatar, Box, Group, Space, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { PostType } from "@/shared/entities";
import { ContentPart, parseContent } from "@/shared/ui/ContentPart/ContentPart";
import { DateFormat } from "@/shared/ui/DateFormat/DateFormat";
import { PostActionMenu } from "@/shared/ui/PostActionMenu/PostActionMenu";
import { PostActionsButtonGroup } from "@/shared/ui/PostActionsButtonGroup/PostActionsButtonGroup";

interface PostProps {
	currentUserId: string;
	keyword?: string;
	post: PostType;
}

export const Post = ({ currentUserId, keyword, post }: PostProps) => {
	const parsedContent = parseContent(post.content);
	const router = useRouter();
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
				return router.push(`/posts/${post.id}`);
			}}
		>
			{isPostByCurrentUser ? (
				<PostActionMenu
					postId={post.id}
					currentUserId={currentUserId}
					postUserId={post.user_id}
					keyword={keyword}
				/>
			) : (
				<></>
			)}
			<Group align="start">
				<Box>
					<Link href={`/profile/${post.user_id}`}>
						<Avatar
							src={post.users.profile_image_url}
							alt="投稿したユーザーのプロフィール画像"
						/>
					</Link>
				</Box>
				<Box>
					<Group spacing="xs">
						<Link
							href={`/profile/${post.user_id}`}
							style={{ textDecoration: "none" }}
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
