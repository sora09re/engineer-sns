import { Modal } from "@mantine/core";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { useModal } from "@/hooks/useModal";
import type { User } from "@/shared/types/user";

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
