import { Box, Button, Space } from "@mantine/core";
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
		// Mantine 7 で Navbar は廃止されたので、v6 の Navbar（fixed）と同じ配置を nav で組む
		<Box
			component="nav"
			p="xl"
			style={{
				backgroundColor: "var(--mantine-color-body)",
				borderRight: "1px solid var(--mantine-color-gray-2)",
				display: "flex",
				flexDirection: "column",
				// v6 の Navbar は下端基準（bottom: 0）で、高さは 100vh だった
				bottom: 0,
				height: "100vh",
				left: 0,
				position: "fixed",
				width: sideBarWidthBase,
				zIndex: 1,
			}}
		>
			<Box mt="md" px="20px" style={{ flex: 1 }}>
				<MainLinks currentUserId={currentUser.id} />
				<Space h="xl" />
				<Button style={{ fontSize: "1.0rem", fontWeight: "bold" }} onClick={postModal.open}>
					投稿する
				</Button>
				<PostModal opened={isPostModalOpened} onClose={postModal.close} />
				<Space h="md" />
				<LogoutButton />
			</Box>
			<Box>
				<AccountButton currentUser={currentUser} />
			</Box>
		</Box>
	);
};
