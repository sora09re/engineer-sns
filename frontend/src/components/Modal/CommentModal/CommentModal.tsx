import { Modal } from "@mantine/core";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import { useModal } from "@/hooks/useModal";

export const CommentModal = () => {
  const [isVisible, setIsVisible] = useModal("comment");

  return isVisible ? (
    <Modal
      title="コメント"
      opened={isVisible}
      onClose={() => {
        return setIsVisible(false);
      }}
      size="80%"
    >
      
    </Modal>
  ) : null;
};
