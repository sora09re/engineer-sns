import { Box, Button, Modal, Text, TextInput } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";

export const LoginModal: FC = () => {
  const [opened, setOpened] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // ここでAPIを呼び出して実際のログインを行います。
    // ログイン成功時と失敗時には適切な通知を表示することができます。
    // この例では、ログイン成功を仮定しています。
    // notifications.showNotification({
    //   color: "blue",
    //   message: "Welcome back, " + username,
    //   title: "Login successful",
    // });
    setOpened(false);
  };

  return (
    <div>
      <Button
        onClick={() => {
          return setOpened(true);
        }}
      >
        ログイン
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          return setOpened(false);
        }}
      >
        <Box>
          <Text fz="xl" fw="bold">ログイン</Text>
          <TextInput
            style={{ marginTop: 30 }}
            placeholder="Username"
            value={username}
            onChange={(event) => {
              return setUsername(event.currentTarget.value);
            }}
          />
          <TextInput
            style={{ marginTop: 10 }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => {
              return setPassword(event.currentTarget.value);
            }}
          />
          <Button fullWidth style={{ marginTop: 30 }} onClick={handleLogin}>
            ログイン
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
