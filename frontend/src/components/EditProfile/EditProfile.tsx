import {
  Button,
  Center,
  FileButton,
  Grid,
  Image,
  Modal,
  Paper,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import type { User } from "@/components/Profile/Profile";

interface EditProfileProps {
  modalOpened: boolean;
  setModalOpened: (opened: boolean) => void;
  setUser: (user: User) => void;
  user: User;
}

export const EditProfile = ({
  modalOpened,
  setModalOpened,
  setUser,
  user,
}: EditProfileProps) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const onSave = () => {
    setUser({
      ...user,
      bio: bio !== "" ? bio : user.bio,
      location: location !== "" ? location : user.location,
      name: name !== "" ? name : user.name,
      profileImage: profileImage !== null ? profileImage : user.profileImage,
      username: username !== "" ? username : user.username,
      website: website !== "" ? website : user.website,
    });
    setModalOpened(false);
  };

  return (
    <Modal
      opened={modalOpened}
      onClose={() => {
        return setModalOpened(false);
      }}
      title="プロフィールを編集"
      withCloseButton
    >
      <Paper p="md">
        <Grid grow>
          <Grid.Col span={4}>
            <Center>
              <Image
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : URL.createObjectURL(user.profileImage)
                }
                alt="Profile image"
                width={120}
                height={120}
              />
            </Center>
            <FileButton
              onChange={setProfileImage}
              accept="image/png,image/jpeg"
            >
              {(props) => {
                return <Button {...props}>Upload Profile Image</Button>;
              }}
            </FileButton>

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
