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
import { useGetProfile } from "@/hooks/useGetProfile";
import { useModal } from "@/hooks/useModal";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

interface EditProfileModalProps {
  currentUser: User;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  name: string;
  profile_image_url?: string;
  username: string;
  website?: string;
}

const useUserProfile = (currentUser: any) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: currentUser.bio,
    location: currentUser.location,
    name: currentUser.name,
    profile_image_url: currentUser.profile_image_url,
    username: currentUser.username,
    website: currentUser.website,
  });

  const updateUserProfile = (newUserProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      return { ...prev, ...newUserProfile };
    });
  };

  return { updateUserProfile, userProfile };
};

export const EditProfileModal = ({ currentUser }: EditProfileModalProps) => {
  const marginTopPx = 10;
  const { updateUserProfile, userProfile } = useUserProfile(currentUser);
  const { mutate } = useGetProfile(currentUser.id);

  const [isVisible, setIsVisible] = useModal("editProfile");

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
      await axios.post(`${baseURL}/api/profile/${currentUser.id}`, {
        values: userProfile,
      });
      setIsVisible(false);
      mutate();
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
                profile_image_url={userProfile.profile_image_url}
                userProfileImage={userProfile.profile_image_url}
                setUserProfileImage={updateUserProfile}
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
