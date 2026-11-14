import { Button, Navbar, Space } from "@mantine/core";

import { AccountButton } from "@/components/AccountButton/AccountButton";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { MainLinks } from "@/components/MainLinks/MainLinks";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useModal } from "@/hooks/useModal";
import { sideBarWidthBase } from "@/utils/sideBarWidth";

export const Sidebar = () => {
	const currentUser = useCurrentUser();
	const [, setIsVisiblePostModal] = useModal("post");

	return (
		<Navbar width={{ base: sideBarWidthBase }} p="xl" fixed={true} style={{ zIndex: 1 }}>
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
				<PostModal />
				<Space h="md" />
				<LogoutButton />
			</Navbar.Section>
			<Navbar.Section>
				<AccountButton currentUser={currentUser} />
			</Navbar.Section>
		</Navbar>
	);
};
