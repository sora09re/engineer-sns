import { Modal } from "@mantine/core";
import type { KeyedMutator } from "swr";

import { NewPostForm } from "@/components/NewPostForm/NewPostForm";
import { useModal } from "@/hooks/useModal";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";

interface PostModalProps {
  currentUser: User;
  mutate?: KeyedMutator<PostType[]>;
}

export const PostModal = ({ currentUser, mutate }: PostModalProps) => {
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
      <NewPostForm currentUser={currentUser} mutate={mutate} />
    </Modal>
  );
};
