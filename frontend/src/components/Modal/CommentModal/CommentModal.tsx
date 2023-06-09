import { Modal } from "@mantine/core";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { useModal } from "@/hooks/useModal";

export const CommentModal = () => {
  const [isVisible, setIsVisible] = useModal("comment");

  return isVisible ? (
    <Modal
      opened={isVisible}
      onClose={() => {
        return setIsVisible(false);
      }}
    >
      <NewPostForm />
    </Modal>
  ) : null;
};
