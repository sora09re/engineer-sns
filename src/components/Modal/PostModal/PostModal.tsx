import { Modal } from "@mantine/core";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";

interface PostModalProps {
	opened: boolean;
	onClose: () => void;
}

export const PostModal = ({ opened, onClose }: PostModalProps) => {
	return (
		<Modal size={800} opened={opened} onClose={onClose} withCloseButton>
			<NewPostForm onPosted={onClose} />
		</Modal>
	);
};
