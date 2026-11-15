import { Box, Group, Text, ThemeIcon } from "@mantine/core";
import { IconHome2, IconSearch, IconUserCircle } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import classes from "./MainLinks.module.css";

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
		<Box className={classes.link}>
			<Group>
				<ThemeIcon color="white" className={classes.icon}>
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
