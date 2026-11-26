import { Box, Menu } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { notifyMutation } from "@/shared/lib";

import { useDeletePost } from "../api/useDeletePost";

interface PostActionMenuProps {
	postId: string;
	onDeleted?: () => void;
}

export const PostActionMenu = ({ postId, onDeleted }: PostActionMenuProps) => {
	const [opened, setOpened] = useState(false);
	const removePost = useDeletePost();

	const deletePost = async () => {
		if (await notifyMutation(removePost, postId, { label: "削除", success: "削除しました。" })) {
			onDeleted?.();
		}
	};

	return (
		<Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
			<Menu.Target>
				<Box
					role="button"
					aria-label="投稿メニュー"
					style={{ position: "absolute", right: 20, top: 10 }}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<IconDots />
				</Box>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item
					color="red"
					leftSection={<IconTrash size={14} />}
					fw="bold"
					onClick={(event) => {
						event.stopPropagation();
						void deletePost();
					}}
				>
					削除
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};
