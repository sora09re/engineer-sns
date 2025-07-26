import { Button, Navbar, Space } from "@mantine/core";

import { AccountButton } from "@/shared/components/AccountButton/AccountButton";
import { LoginButton } from "@/shared/components/LoginButton/LoginButton";
import { MainLinks } from "@/shared/components/MainLinks/MainLinks";
import { PostModal } from "@/shared/components/Modal/PostModal/PostModal";
import type { User } from "@/shared/entities";
import { useModal } from "@/shared/model";
import { sideBarWidthBase } from "@/shared/utils/sideBarWidth";

interface SidebarProps {
	currentUser: User;
}

export const Sidebar = ({ currentUser }: SidebarProps) => {
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
				<PostModal currentUser={currentUser} />
				<Space h="md" />
				<LoginButton />
			</Navbar.Section>
			<Navbar.Section>
				<AccountButton currentUser={currentUser} />
			</Navbar.Section>
		</Navbar>
	);
};
