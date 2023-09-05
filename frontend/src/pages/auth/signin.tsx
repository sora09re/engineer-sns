import { Box, Button, Paper, Text, Title } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const SigninPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Paper p="xl" sx={{ maxWidth: 400 }}>
        <Title order={2} align="center" sx={{ marginBottom: 20 }}>
          ログインページ
        </Title>
        <Text sx={{ marginBottom: 20 }}>
          このアプリはエンジニア向けのSNSアプリです。 そのため、ログイン方法は
          Github でのログインのみになります。
        </Text>
        <Button
          fullWidth
          variant="outline"
          color="dark"
          onClick={() => {
            return signIn("github");
          }}
        >
          GitHubでログイン
        </Button>
      </Paper>
    </Box>
  );
};

export default SigninPage;
