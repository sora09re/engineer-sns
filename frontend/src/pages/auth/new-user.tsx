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
import { useForm } from "@mantine/form";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

interface NewUserValues {
  id: string;
  bio: string;
  email: string;
  location: string;
  name: string;
  profile_image_url: string;
  username: string;
  website: string;
}

const NewUserPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const postNewUser = async (values: NewUserValues) => {
    const baseURL = process.env.SERVER
      ? process.env.SERVER
      : "http://localhost:3000";
    try {
      const res = await axios.post(`${baseURL}/api/auth/signup`, values);
      if (res.status === 200) {
        // ステータスが200の場合
        router.push("/"); // ページ"/"に遷移
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const form = useForm({
    initialValues: {
      id: "",
      bio: "",
      email: "",
      location: "",
      name: "",
      profile_image_url: "",
      username: "",
      website: "",
    },

    validate: {
      email: (value) => {
        return /^\S+@\S+$/.test(value);
      },
      name: (value) => {
        return value.trim().length > 0;
      },
      username: (value) => {
        return value.trim().length > 0;
      },
    },
  });

  useEffect(() => {
    if (session?.user?.email && session?.user?.name && session?.user?.image) {
      form.setFieldValue("id", session.user.id);
      form.setFieldValue("email", session.user.email);
      form.setFieldValue("name", session.user.name);
      form.setFieldValue("profile_image_url", session.user.image);
    }
    //TODO: eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <Container size={400} p={20}>
      <Paper p="md">
        <Title order={4} align="center">
          ユーザー新規登録
        </Title>
        <form
          onSubmit={(event) => {
            event.preventDefault(); // デフォルトの動作を防止
            postNewUser(form.values);
          }}
          style={{ marginTop: 15 }}
        >
          <Flex justify="center">
            <ImageUpload image_url={form.values.profile_image_url} />
          </Flex>
          <Grid>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="名前"
                placeholder="Your name"
                value={form.values.name}
                withAsterisk
                onChange={(event) => {
                  return form.setFieldValue("name", event.currentTarget.value);
                }}
                // error={form.errors.name && "Please enter your name"}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="ユーザーネーム"
                placeholder="Your username"
                value={form.values.username}
                withAsterisk
                onChange={(event) => {
                  return form.setFieldValue(
                    "username",
                    event.currentTarget.value
                  );
                }}
                // error={form.errors.username && "Please enter your username"}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="メールアドレス"
                placeholder="Your email"
                value={form.values.email}
                withAsterisk
                onChange={(event) => {
                  return form.setFieldValue("email", event.currentTarget.value);
                }}
                // error={form.errors.email && "Please enter a valid email"}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <Textarea
                label="自己紹介"
                placeholder="Your bio"
                value={form.values.bio}
                onChange={(event) => {
                  return form.setFieldValue("bio", event.currentTarget.value);
                }}
                maxLength={160}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="場所"
                placeholder="Your location"
                value={form.values.location}
                onChange={(event) => {
                  return form.setFieldValue(
                    "location",
                    event.currentTarget.value
                  );
                }}
              />
            </Col>
            <Col style={{ marginTop: 5 }}>
              <TextInput
                label="ウェブサイト"
                placeholder="Your website"
                value={form.values.website}
                onChange={(event) => {
                  return form.setFieldValue(
                    "website",
                    event.currentTarget.value
                  );
                }}
              />
            </Col>
          </Grid>
          <Group position="right" style={{ marginTop: 15 }}>
            <Button type="submit" color="blue">
              送信
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default NewUserPage;
