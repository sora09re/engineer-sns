import {
  Button,
  Col,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useGetToken } from "@/hooks/useGetToken";
import { useHandleNewUser } from "@/hooks/useHandleNewUser";
import {
  type NewUserValues,
  useNewUserProfile,
} from "@/hooks/useNewUserProfile";
import { callPostApi } from "@/utils/callApi";
import { uploadImageToSupabase } from "@/utils/uploadImageToSupabase";

const NewUserPage: NextPage = () => {
  const { session, status } = useHandleNewUser();
  const { updateUserProfile, userProfile } = useNewUserProfile(session?.user);
  const router = useRouter();
  const [tempImage, setTempImage] = useState<string | null>(null);
  const token = useGetToken();

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const objectURL = URL.createObjectURL(file);
    setTempImage(objectURL);
  };

  useEffect(() => {
    if (session?.user?.id) {
      updateUserProfile({
        email: session.user.email,
        name: session.user.name,
        profileImageUrl: session.user.image,
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status === "loading") {
    <CenteredLoader />;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  }

  const postNewUser = async (values: NewUserValues) => {
    notifications.show({
      id: "createProfile",
      autoClose: false,
      loading: true,
      message: "しばらくお待ちください。",
      title: "ユーザー作成中...",
      withCloseButton: false,
    });
    try {
      const imageUrl = await uploadImageToSupabase(
        tempImage,
        session?.user?.id
      );
      if (imageUrl) {
        updateUserProfile({ profileImageUrl: imageUrl });
      }
      const result = await callPostApi("/profile", values, token);
      notifications.update({
        id: "createProfile",
        autoClose: 2000,
        color: "green",
        icon: <IconCheck size="1rem" />,
        message: "ユーザー作成に成功しました！",
        title: "成功",
      });
      if (result.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      notifications.update({
        id: "createProfile",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "ユーザー作成に失敗しました。",
        title: "エラー",
      });
    }
  };

  return (
    <Container size={400} p={20}>
      <Paper p="md">
        <Title order={4} align="center">
          ユーザー新規登録
        </Title>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
          style={{ marginTop: 15 }}
        >
          <Flex justify="center">
            <ImageUpload
              onDrop={handleDrop}
              imageUrl={tempImage || userProfile.profileImageUrl}
            />
          </Flex>
          <Grid>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="名前"
                placeholder="Your name"
                value={userProfile.name}
                withAsterisk
                onChange={(e) => {
                  return updateUserProfile({ name: e.currentTarget.value });
                }}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="ユーザーネーム"
                placeholder="Your username"
                value={userProfile.username}
                withAsterisk
                onChange={(e) => {
                  return updateUserProfile({ username: e.currentTarget.value });
                }}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="メールアドレス"
                placeholder="Your email"
                value={userProfile.email}
                withAsterisk
                onChange={(e) => {
                  return updateUserProfile({ email: e.currentTarget.value });
                }}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <Textarea
                label="自己紹介"
                placeholder="Your bio"
                value={userProfile.bio}
                onChange={(e) => {
                  return updateUserProfile({ bio: e.currentTarget.value });
                }}
                maxLength={160}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="場所"
                placeholder="Your location"
                value={userProfile.location}
                onChange={(e) => {
                  return updateUserProfile({ location: e.currentTarget.value });
                }}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="ウェブサイト"
                placeholder="Your website"
                value={userProfile.website}
                onChange={(e) => {
                  return updateUserProfile({ website: e.currentTarget.value });
                }}
              />
            </Col>
          </Grid>
          <Group position="right" style={{ marginTop: 15 }}>
            <Button
              type="submit"
              color="blue"
              onClick={() => {
                return postNewUser(userProfile);
              }}
            >
              送信
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default NewUserPage;
