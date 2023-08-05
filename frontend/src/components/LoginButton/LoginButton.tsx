import { Button, Text } from "@mantine/core";
import { IconLogin, IconLogout } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";

export const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <Button
        sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
        onClick={() => {
          return signOut();
        }}
      >
        <IconLogout size="1.5rem" stroke={1.5} />
        <Text>ログアウト</Text>
      </Button>
    );
  }
  return (
    <Button
      sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
      onClick={() => {
        return signIn("github");
      }}
    >
      <IconLogin size="1.5rem" stroke={1.5} />
      <Text>ログイン</Text>
    </Button>
  );
};
