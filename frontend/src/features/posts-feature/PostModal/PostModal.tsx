import { Modal } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";
import type { Post } from "@/pages/_app";

type PostModalProps = {
  modalOpened: boolean;
  posts: Post[];
  setModalOpened: (opened: boolean) => void;
  setPosts: Dispatch<SetStateAction<Post[]>>;
};

export const PostModal = ({
  modalOpened,
  posts,
  setModalOpened,
  setPosts,
}: PostModalProps) => {
  return (
    <Modal
      opened={modalOpened}
      onClose={() => {
        return setModalOpened(false);
      }}
      title="投稿"
      withCloseButton
    >
      <NewPostForm
        posts={posts}
        setPosts={setPosts}
        setModalOpened={setModalOpened}
      />
    </Modal>
  );
};
