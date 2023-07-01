import {
  Box,
  Button,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

import { useModal } from "@/hooks/useModal";

export const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useModal("login");
  const [, setIsVisibleSignupModal] = useModal("signup");

  const handleLogin = () => {
    // ここでAPIを呼び出して実際のログインを行います。
    // ログイン成功時と失敗時には適切な通知を表示することができます。
    // この例では、ログイン成功を仮定しています。
    // notifications.showNotification({
    //   color: "blue",
    //   message: "Welcome back, " + username,
    //   title: "Login successful",
    // });
    setIsVisibleLoginModal(false);
  };

  const openSignupModal = () => {
    setIsVisibleLoginModal(false);
    setIsVisibleSignupModal(true);
  };

  return (
    <Modal
      opened={isVisibleLoginModal}
      onClose={() => {
        return setIsVisibleLoginModal(false);
      }}
      withCloseButton
    >
      <Box>
        <Text fz="xl" fw="bold">
          ログイン
        </Text>
        <TextInput
          label="ユーザー名"
          placeholder="UserName"
          mt="lg"
          value={username}
          onChange={(event) => {
            return setUsername(event.currentTarget.value);
          }}
        />
        <PasswordInput
          label="パスワード"
          placeholder="Password"
          mt="md"
          value={password}
          onChange={(event) => {
            return setPassword(event.currentTarget.value);
          }}
        />
        <Button fullWidth mt="lg" onClick={handleLogin}>
          ログイン
        </Button>
        <Text mt="lg" color="gray">
          アカウントをお持ちでない場合は
          <Link href="" onClick={openSignupModal}>
            登録
          </Link>
        </Text>
      </Box>
    </Modal>
  );
};
