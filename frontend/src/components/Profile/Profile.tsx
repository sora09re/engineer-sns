import { Button, Grid, Image, Paper, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";

import { useModal } from "@/hooks/useModal";
import type { User } from "@/types/user";

export const Profile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [, setIsVisible] = useModal("editProfile");

  useEffect(() => {
    fetch("/api/current")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return setCurrentUser(data);
      });
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleFollow = () => {
    alert("フォロー機能を実装");
  };

  // const handleFollow = async () => {
  //   try {
  //     const response = await axios.post("/api/follow", { userId: user.id });
  //     if (response.status === 200) {
  //       // Update user state or show a success message
  //     }
  //   } catch (error) {
  //     // Handle error
  //   }
  // };

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
            src={currentUser.profileImageUrl}
            alt="Profile image"
            width={120}
            height={120}
            withPlaceholder
          />
          <Text size="xl">{currentUser.name}</Text>
          <Text color="gray">{currentUser.username}</Text>
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Text size="sm">フォロー: 100</Text>
          <Text size="sm">フォロワー: 200</Text>
        </Grid.Col>
      </Grid>
      <Text size="md">{currentUser.bio}</Text>
      <Grid>
        <Grid.Col span={12}>
          <Text size="sm">ウェブサイト: {currentUser.website}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm">ツイート: 1000</Text>
          <Text size="sm">いいね: 3000</Text>
        </Grid.Col>
      </Grid>
      <Button onClick={handleFollow}>フォロー</Button>
      <Space w={20} h={10} />
      <Button
        onClick={() => {
          return setIsVisible(true);
        }}
      >
        プロフィールを編集
      </Button>
    </Paper>
  );
};
