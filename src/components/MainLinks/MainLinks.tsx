import { Box, Group, Text, ThemeIcon } from "@mantine/core";
import { IconHome2, IconSearch, IconUserCircle } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

interface MainLinkContentProps {
	icon: React.ReactNode;
	label: string;
}

interface MainLinksProps {
	currentUserId: string;
}

const linkStyle = { color: "inherit", display: "block", textDecoration: "none" } as const;

const MainLinkContent = ({ icon, label }: MainLinkContentProps) => {
	return (
		<Box
			sx={(theme) => {
				return {
					"&:hover": {
						backgroundColor:
							theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
					},
					borderRadius: theme.radius.sm,
					color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
					display: "block",
					padding: theme.spacing.xs,
					width: "100%",
				};
			}}
		>
			<Group>
				<ThemeIcon
					color="white"
					sx={(theme) => {
						return {
							"&:hover": {
								color: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
							},
						};
					}}
				>
					{icon}
				</ThemeIcon>

				<Text size="lg">{label}</Text>
			</Group>
		</Box>
	);
};

export const MainLinks = ({ currentUserId }: MainLinksProps) => {
	return (
		<div>
			<Link to="/" style={linkStyle}>
				<MainLinkContent
					icon={<IconHome2 size="2.0rem" stroke={1.5} color="black" />}
					label="ホーム"
				/>
			</Link>
			<Link to="/search" style={linkStyle}>
				<MainLinkContent
					icon={<IconSearch size="2.0rem" stroke={1.5} color="black" />}
					label="検索"
				/>
			</Link>
			<Link to="/profile/$userId" params={{ userId: currentUserId }} style={linkStyle}>
				<MainLinkContent
					icon={<IconUserCircle size="2.0rem" stroke={1.5} color="black" />}
					label="プロフィール"
				/>
			</Link>
		</div>
	);
};
