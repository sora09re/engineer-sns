import { Box, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDots, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useDeletePost } from "../api/useDeletePost";

interface PostActionMenuProps {
	postId: string;
	onDeleted?: () => void;
}

export const PostActionMenu = ({ postId, onDeleted }: PostActionMenuProps) => {
	const [opened, setOpened] = useState(false);
	const removePost = useDeletePost();

	const deletePost = async () => {
		notifications.show({
			id: "deletePost",
			autoClose: false,
			loading: true,
			message: "しばらくお待ちください。",
			title: "削除中...",
			withCloseButton: false,
		});
		try {
			await removePost.mutateAsync(postId);
		} catch {
			notifications.update({
				id: "deletePost",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "削除失敗しました。",
				title: "エラー",
			});
			return;
		}
		notifications.update({
			id: "deletePost",
			autoClose: 2000,
			color: "green",
			icon: <IconCheck size="1rem" />,
			message: "削除しました。",
			title: "成功",
		});
		onDeleted?.();
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
