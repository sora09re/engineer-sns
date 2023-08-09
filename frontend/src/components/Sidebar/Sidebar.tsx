import { Button, Navbar, Space } from "@mantine/core";

import { AccountButton } from "@/components/AccountButton/AccountButton";
import { LoginButton } from "@/components/LoginButton/LoginButton";
import { MainLinks } from "@/components/MainLinks/MainLinks";
import { useModal } from "@/hooks/useModal";
import type { User } from "@/types/user";

interface SidebarProps {
  currentUser: Pick<User, "name" | "username" | "profile_image_url">;
}

export const Sidebar = ({ currentUser }: SidebarProps) => {
  const [, setIsVisiblePostModal] = useModal("post");

  return (
    <Navbar width={{ base: 350 }} p="xl">
      <Navbar.Section grow mt="md" px="20px">
        <MainLinks />
        <Space h="xl" />
        <Button
          sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
          onClick={() => {
            return setIsVisiblePostModal(true);
          }}
        >
          投稿する
        </Button>
        <Space h="md" />
        <LoginButton />
      </Navbar.Section>
      <Navbar.Section>
        <AccountButton currentUser={currentUser} />
      </Navbar.Section>
    </Navbar>
  );
};
