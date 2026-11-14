import { Button, Navbar, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { AccountButton } from "@/components/AccountButton/AccountButton";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { MainLinks } from "@/components/MainLinks/MainLinks";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

export const Sidebar = () => {
	const currentUser = useCurrentUser();
	const [isPostModalOpened, postModal] = useDisclosure(false);

	return (
		<Navbar width={{ base: sideBarWidthBase }} p="xl" fixed={true} style={{ zIndex: 1 }}>
			<Navbar.Section grow mt="md" px="20px">
				<MainLinks currentUserId={currentUser.id} />
				<Space h="xl" />
				<Button sx={{ fontSize: "1.0rem", fontWeight: "bold" }} onClick={postModal.open}>
					投稿する
				</Button>
				<PostModal opened={isPostModalOpened} onClose={postModal.close} />
				<Space h="md" />
				<LogoutButton />
			</Navbar.Section>
			<Navbar.Section>
				<AccountButton currentUser={currentUser} />
			</Navbar.Section>
		</Navbar>
	);
};
