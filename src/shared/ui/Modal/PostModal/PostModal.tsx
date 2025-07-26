import { Modal } from "@mantine/core";

import type { User } from "@/shared/entities";
import { useModal } from "@/shared/model";
import { NewPostForm } from "@/shared/ui/NewPostForm/NewPostForm";

interface PostModalProps {
	currentUser: User;
}

export const PostModal = ({ currentUser }: PostModalProps) => {
	const [isVisible, setIsVisible] = useModal("post");

	return (
		<Modal
			size={800}
			opened={isVisible}
			onClose={() => {
				return setIsVisible(false);
			}}
			withCloseButton
		>
			<NewPostForm currentUser={currentUser} />
		</Modal>
	);
};
