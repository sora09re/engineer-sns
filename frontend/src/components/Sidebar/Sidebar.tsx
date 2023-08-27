import { Button, Navbar, Space } from "@mantine/core";
import { type KeyedMutator } from "swr";

import { AccountButton } from "@/components/AccountButton/AccountButton";
import { LoginButton } from "@/components/LoginButton/LoginButton";
import { MainLinks } from "@/components/MainLinks/MainLinks";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { useModal } from "@/hooks/useModal";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

interface SidebarProps {
  currentUser: User;
  mutate?: KeyedMutator<PostType[]>;
}

export const Sidebar = ({ currentUser, mutate }: SidebarProps) => {
  const [, setIsVisiblePostModal] = useModal("post");

  return (
    <Navbar
      width={{ base: sideBarWidthBase }}
      p="xl"
      fixed={true}
      style={{ zIndex: 1 }}
    >
      <Navbar.Section grow mt="md" px="20px">
        <MainLinks currentUserId={currentUser.id} />
        <Space h="xl" />
        <Button
          sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
          onClick={() => {
            return setIsVisiblePostModal(true);
          }}
        >
          投稿する
        </Button>
        <PostModal currentUser={currentUser} mutate={mutate} />
        <Space h="md" />
        <LoginButton />
      </Navbar.Section>
      <Navbar.Section>
        <AccountButton currentUser={currentUser} />
      </Navbar.Section>
    </Navbar>
  );
};
