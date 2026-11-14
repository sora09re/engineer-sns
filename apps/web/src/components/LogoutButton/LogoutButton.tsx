import { Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLogout, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { signOut } from "@/api/session";

export const LogoutButton = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleLogout = async () => {
		try {
			await signOut();
			await navigate({ to: "/auth/signin" });
			queryClient.clear();
		} catch {
			notifications.show({
				id: "logout-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "ログアウトに失敗しました。",
				title: "エラー",
			});
		}
	};

	return (
		<Button style={{ fontSize: "1.0rem", fontWeight: "bold" }} onClick={handleLogout}>
			<IconLogout size="1.5rem" stroke={1.5} />
			<Text fw="bold">ログアウト</Text>
		</Button>
	);
};
