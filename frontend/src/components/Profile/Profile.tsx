import { Button, Grid, Image, Paper, Text } from "@mantine/core";
import { useRecoilState } from "recoil";

import { useModal } from "@/hooks/useModal";
import { userState } from "@/stores/userState";

export const Profile = () => {
  const [user] = useRecoilState(userState);
  const [, setIsVisible] = useModal("editProfile");

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
          return setIsVisible(true);
        }}
      >
        プロフィールを編集
      </Button>
    </Paper>
  );
};
