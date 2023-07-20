import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconHome2, IconSearch, IconUserCircle } from "@tabler/icons";
import Link from "next/link";

interface MainLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const MainLink = ({ href, icon, label }: MainLinkProps) => {
  return (
    <UnstyledButton
      component={Link}
      href={href}
      sx={(theme) => {
        return {
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
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
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            };
          }}
        >
          {icon}
        </ThemeIcon>

        <Text size="lg">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const data = [
  {
    href: "/",
    icon: <IconHome2 size="2.0rem" stroke={1.5} color="black" />,
    label: "ホーム",
  },
  {
    href: "/search",
    icon: <IconSearch size="2.0rem" stroke={1.5} color="black" />,
    label: "検索",
  },
  {
    href: `/users/123`,
    icon: <IconUserCircle size="2.0rem" stroke={1.5} color="black" />,
    label: "プロフィール",
  },
];

export const MainLinks = () => {
  const links = data.map((link) => {
    return <MainLink {...link} key={link.label} />;
  });
  return <div>{links}</div>;
};
