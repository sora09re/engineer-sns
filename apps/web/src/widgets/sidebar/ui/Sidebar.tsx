import { Box, Button, Modal, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { AccountButton } from "./AccountButton";
import { LogoutButton } from "./LogoutButton";
import { MainLinks } from "./MainLinks";
import { NewPostForm } from "@/features/create-post";
import { useCurrentUser } from "@/entities/user";
import { sideBarWidthBase } from "../config/sideBarWidth";

export const Sidebar = () => {
	const currentUser = useCurrentUser();
	const [isPostModalOpened, postModal] = useDisclosure(false);

	return (
		<Box
			component="nav"
			p="xl"
			style={{
				backgroundColor: "var(--mantine-color-body)",
				borderRight: "1px solid var(--mantine-color-gray-2)",
				display: "flex",
				flexDirection: "column",
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
				<Modal size={800} opened={isPostModalOpened} onClose={postModal.close} withCloseButton>
					<NewPostForm onPosted={postModal.close} />
				</Modal>
				<Space h="md" />
				<LogoutButton />
			</Box>
			<Box>
				<AccountButton currentUser={currentUser} />
			</Box>
		</Box>
	);
};
