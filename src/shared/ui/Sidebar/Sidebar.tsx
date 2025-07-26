import { Button, Navbar, Space } from "@mantine/core";

import type { User } from "@/shared/entities";
import { sideBarWidthBase } from "@/shared/lib/const";
import { useModal } from "@/shared/model";
import { AccountButton } from "@/shared/ui/AccountButton/AccountButton";
import { LoginButton } from "@/shared/ui/LoginButton/LoginButton";
import { MainLinks } from "@/shared/ui/MainLinks/MainLinks";
import { PostModal } from "@/shared/ui/Modal/PostModal/PostModal";

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
