import {
  Button,
  Center,
  Grid,
  Modal,
  Paper,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useGetPostsForUser } from "@/hooks/useGetPostsForUser";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useModal } from "@/hooks/useModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";
import { uploadImageToSupabase } from "@/utils/uploadImageToSupabase";

interface EditProfileModalProps {
  currentUser: User;
}

export const EditProfileModal = ({ currentUser }: EditProfileModalProps) => {
  const marginTopPx = 10;
  const { updateUserProfile, userProfile } = useUserProfile(currentUser);
  const { mutate: getProfileMutate } = useGetProfile(currentUser.id);
  const { mutate: getPostsForUserMutate } = useGetPostsForUser(currentUser.id);
  const [isVisible, setIsVisible] = useModal("editProfile");
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const objectURL = URL.createObjectURL(file);
    setTempImage(objectURL);
  };

  const editProfile = async () => {
    notifications.show({
      id: "updateProfile",
      autoClose: false,
      loading: true,
      message: "しばらくお待ちください。",
      title: "更新中...",
      withCloseButton: false,
    });

    try {
      const imageUrl = await uploadImageToSupabase(tempImage, currentUser.id);
      if (imageUrl) {
        updateUserProfile({ profile_image_url: imageUrl });
      }

      await axios.post(`${baseURL}/api/profile/${currentUser.id}`, {
        values: userProfile,
      });
      setIsVisible(false);
      getProfileMutate();
      getPostsForUserMutate();
      notifications.update({
        id: "updateProfile",
        autoClose: 2000,
        color: "green",
        icon: <IconCheck size="1rem" />,
        message: "更新に成功しました！",
        title: "成功",
      });
    } catch (error) {
      notifications.update({
        id: "updateProfile",
        autoClose: 2000,
        color: "red",
        icon: <IconX size="1rem" />,
        message: "更新に失敗しました。",
        title: "エラー",
      });
    }
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
            <Center>
              <ImageUpload
                onDrop={handleDrop}
                imageUrl={tempImage || userProfile.profile_image_url}
              />
            </Center>
            <TextInput
              label="名前"
              placeholder={userProfile.name}
              value={userProfile.name}
              onChange={(e) => {
                return updateUserProfile({ name: e.currentTarget.value });
              }}
              mt={marginTopPx}
            />
            <TextInput
              label="ユーザー名"
              placeholder={userProfile.username}
              value={userProfile.username}
              onChange={(e) => {
                return updateUserProfile({ username: e.currentTarget.value });
              }}
              mt={marginTopPx}
            />
            <Textarea
              label="自己紹介"
              placeholder={userProfile.bio}
              value={userProfile.bio}
              onChange={(e) => {
                return updateUserProfile({ bio: e.currentTarget.value });
              }}
              maxLength={160}
              minRows={4}
              mt={marginTopPx}
            />
            <TextInput
              label="場所"
              placeholder={userProfile.location}
              value={userProfile.location}
              onChange={(e) => {
                return updateUserProfile({ location: e.currentTarget.value });
              }}
              mt={marginTopPx}
            />
            <TextInput
              label="ウェブサイト"
              placeholder={userProfile.website}
              value={userProfile.website}
              onChange={(e) => {
                return updateUserProfile({ website: e.currentTarget.value });
              }}
              mt={marginTopPx}
            />

            <Button
              onClick={() => {
                return editProfile();
              }}
              mt={marginTopPx}
            >
              保存
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Modal>
  );
};
