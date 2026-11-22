import { Avatar, Box, Flex, Space, Text } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";

import { FollowButton } from "@/features/toggle-follow";
import type { UserView } from "@engineer-sns/shared";

type UserItemProps = {
	propsUser: UserView;
};

export const UserItem = ({ propsUser }: UserItemProps) => {
	const navigate = useNavigate();

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
							<Text c="dimmed">@{propsUser.username}</Text>
						</Box>
						<FollowButton user={propsUser} />
					</Flex>
					<Text variant="h5">{propsUser.bio}</Text>
				</Box>
			</Flex>
		</Box>
	);
};
