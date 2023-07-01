import {
  Box,
  Button,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

import { useModal } from "@/hooks/useModal";

export const SignupModal = () => {
  const [isVisibleSignupModal, setIsVisibleSignupModal] = useModal("signup");
  const [, setIsVisibleLoginModal] = useModal("login");

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      username: "",
    },

    transformValues: (values) => {
      return {
        email: String(values.email),
        name: String(values.email),
        password: String(values.password),
        username: String(values.username),
      };
    },
  });

  const handleSubmit = () => {
    // if (!form.valid) {
    //   showNotification({
    //     color: "red",
    //     message: "Please correct the errors and try again",
    //     title: "Invalid form",
    //   });
    //   return;
    // }

    close();
  };

  const openLoginModal = () => {
    setIsVisibleSignupModal(false);
    setIsVisibleLoginModal(true);
  };

  return (
    <Modal
      opened={isVisibleSignupModal}
      onClose={() => {
        return setIsVisibleSignupModal(false);
      }}
      withCloseButton
    >
      <Box>
        <Text fz="xl" fw="bold">
          登録
        </Text>
        <TextInput
          label="メールアドレス"
          placeholder="Email"
          {...form.getInputProps("email")}
          mt="lg"
        />
        <TextInput
          label="名前"
          placeholder="Name"
          mt="md"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="ユーザー名"
          placeholder="UserName"
          mt="md"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="パスワード"
          placeholder="Password"
          mt="md"
          {...form.getInputProps("password")}
        />
        <Button fullWidth mt="lg" onClick={handleSubmit}>
          登録
        </Button>
        <Text mt="lg" color="gray">
          アカウントをお持ちの場合は
          <Link href="" onClick={openLoginModal}>
            ログイン
          </Link>
        </Text>
      </Box>
    </Modal>
  );
};
