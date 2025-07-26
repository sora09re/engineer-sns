import type { PostType } from "@/shared/entities";
import { Post } from "@/shared/ui/Post/Post";
import type { User } from "@auth/core/types";
import { Box, Space } from "@mantine/core";

interface CommentListProps {
	comments: PostType[];
	currentUser: User;
}

export const CommentList = ({ comments, currentUser }: CommentListProps) => {
	return (
		<Box>
			{comments.map((comment) => {
				return (
					<div key={comment.id}>
						<Post post={comment} currentUserId={currentUser.id} />
						<Space h={20} />
					</div>
				);
			})}
		</Box>
	);
};
