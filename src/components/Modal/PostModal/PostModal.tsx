import { Modal } from "@mantine/core";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { useModal } from "@/hooks/useModal";

export const PostModal = () => {
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
			<NewPostForm />
		</Modal>
	);
};
