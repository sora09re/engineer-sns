import { Button, Grid, Image, Paper, Text } from "@mantine/core";
import { useState } from "react";

import { EditProfile } from "@/components/EditProfile/EditProfile";

export type User = {
  bio: string;
  location: string;
  name: string;
  profileImage: File;
  username: string;
  website: string;
};

export const defaultUser: User = {
  bio: "Software Engineer",
  location: "Tokyo, Japan",
  name: "John Doe",
  profileImage: new File([""], "dummy.jpg"),
  username: "@johndoe",
  website: "https://johndoe.com",
};

export const Profile = () => {
  const [user, setUser] = useState<User>(defaultUser);
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <Paper p="md" shadow="xs">
      <Grid>
        <Grid.Col
          span={12}
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Image
            src={URL.createObjectURL(user.profileImage)}
            alt="Profile image"
            width={120}
            height={120}
            withPlaceholder
          />
          <Text size="xl">{user.name}</Text>
          <Text color="gray">{user.username}</Text>
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Text size="sm">フォロー: 100</Text>
          <Text size="sm">フォロワー: 200</Text>
        </Grid.Col>
      </Grid>
      <Text size="md">{user.bio}</Text>
      <Grid>
        <Grid.Col span={12}>
          <Text size="sm">場所: {user.location}</Text>
          <Text size="sm">ウェブサイト: {user.website}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm">ツイート: 1000</Text>
          <Text size="sm">メディア: 200</Text>
          <Text size="sm">いいね: 3000</Text>
        </Grid.Col>
      </Grid>
      <Button
        onClick={() => {
          return setModalOpened(true);
        }}
      >
        プロフィールを編集
      </Button>
      <EditProfile
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        user={user}
        setUser={setUser}
      />
    </Paper>
  );
};
