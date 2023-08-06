import {
  Button,
  Grid,
  Modal,
  Paper,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useModal } from "@/hooks/useModal";
import { userState } from "@/stores/userState";

export const EditProfileModal = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profileImageUrl] = useState("");

  const [isVisible, setIsVisible] = useModal("editProfile");
  const [user, setUser] = useRecoilState(userState);

  const onSave = () => {
    setUser({
      ...user,
      bio: bio !== "" ? bio : user.bio,
      location: location !== "" ? location : user.location,
      name: name !== "" ? name : user.name,
      profileImageUrl:
        profileImageUrl !== "" ? profileImageUrl : user.profileImageUrl,
      username: username !== "" ? username : user.username,
      website: website !== "" ? website : user.website,
    });
    setIsVisible(false);
  };

  return (
    <Modal
      opened={isVisible}
      onClose={() => {
        return setIsVisible(false);
      }}
      title="プロフィールを編集"
      withCloseButton
    >
      <Paper p="md">
        <Grid grow>
          <Grid.Col span={4}>
            <ImageUpload image_url={profileImageUrl} />
            <TextInput
              label="名前"
              placeholder={user.name}
              value={name}
              onChange={(e) => {
                return setName(e.currentTarget.value);
              }}
            />
            <TextInput
              label="ユーザー名"
              placeholder={user.username}
              value={username}
              onChange={(e) => {
                return setUsername(e.currentTarget.value);
              }}
            />
            <Textarea
              label="自己紹介"
              placeholder={user.bio}
              value={bio}
              onChange={(e) => {
                return setBio(e.currentTarget.value);
              }}
              maxLength={160}
            />
            <TextInput
              label="場所"
              placeholder={user.location}
              value={location}
              onChange={(e) => {
                return setLocation(e.currentTarget.value);
              }}
            />
            <TextInput
              label="ウェブサイト"
              placeholder={user.website}
              value={website}
              onChange={(e) => {
                return setWebsite(e.currentTarget.value);
              }}
            />

            <Button onClick={onSave}>保存</Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Modal>
  );
};
