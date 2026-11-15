import { Avatar, Box, Flex, Space, Text } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";

import { FollowButton } from "@/components/FollowButton/FollowButton";
import type { User } from "@/types/user";

type UserItemProps = {
	currentUserId: string;
	propsUser: User;
};

export const UserItem = ({ currentUserId, propsUser }: UserItemProps) => {
	const navigate = useNavigate();
	const isCurrentUser = currentUserId === propsUser.id;

	return (
		<Box
			p="md"
			w="100%"
			style={{ borderBottom: "1px solid #E9ECEF", cursor: "pointer" }}
			onClick={() => {
				return navigate({ to: "/profile/$userId", params: { userId: propsUser.id } });
			}}
		>
			<Flex>
				<Link to="/profile/$userId" params={{ userId: propsUser.id }}>
					<Avatar src={propsUser.profile_image_url} alt="プロフィール画像" />
				</Link>
				<Space w="1rem" />
				<Box w="100%">
					<Flex justify="space-between">
						<Box>
							<Link
								to="/profile/$userId"
								params={{ userId: propsUser.id }}
								style={{ textDecoration: "none" }}
							>
								<Text fw={700} c="black">
									{propsUser.name}
								</Text>
							</Link>
							<Text c="dimmed">
								@{propsUser.username}
								{/* {" "}
                <Badge color="gray">フォローされています</Badge> */}
							</Text>
						</Box>
						{isCurrentUser ? <></> : <FollowButton userId={propsUser.id} />}
					</Flex>
					<Text variant="h5">{propsUser.bio}</Text>
				</Box>
			</Flex>
		</Box>
	);
};
