import { Button, Grid, Modal, Paper, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { useModal } from "@/hooks/useModal";
import type { User } from "@/types/user";

interface EditProfileModalProps {
  currentUser: User;
}

type UserProfile = {
  bio?: string;
  location?: string;
  name: string;
  profileImageUrl?: string;
  username: string;
  website?: string;
};

const useUserProfile = (currentUser: any) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: currentUser.bio,
    location: currentUser.location,
    name: currentUser.name,
    profileImageUrl: currentUser.profile_image_url,
    username: currentUser.username,
  });

  const updateUserProfile = (newUserProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      return { ...prev, ...newUserProfile };
    });
  };

  return { updateUserProfile, userProfile };
};

export const EditProfileModal = ({ currentUser }: EditProfileModalProps) => {
  const { updateUserProfile, userProfile } = useUserProfile(currentUser);

  const [isVisible, setIsVisible] = useModal("editProfile");

  const editProfile = () => {
    alert("editProfileのAPIを実装する");
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
            <ImageUpload image_url={userProfile.profileImageUrl} />
            <TextInput
              label="名前"
              placeholder={userProfile.name}
              value={userProfile.name}
              onChange={(e) => {
                return updateUserProfile({ name: e.currentTarget.value });
              }}
            />
            <TextInput
              label="ユーザー名"
              placeholder={userProfile.username}
              value={userProfile.username}
              onChange={(e) => {
                return updateUserProfile({ username: e.currentTarget.value });
              }}
            />
            <Textarea
              label="自己紹介"
              placeholder={userProfile.bio}
              value={userProfile.bio}
              onChange={(e) => {
                return updateUserProfile({ bio: e.currentTarget.value });
              }}
              maxLength={160}
            />
            <TextInput
              label="場所"
              placeholder={userProfile.location}
              value={userProfile.location}
              onChange={(e) => {
                return updateUserProfile({ location: e.currentTarget.value });
              }}
            />
            <TextInput
              label="ウェブサイト"
              placeholder={userProfile.website}
              value={userProfile.website}
              onChange={(e) => {
                return updateUserProfile({ website: e.currentTarget.value });
              }}
            />

            <Button onClick={editProfile}>保存</Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Modal>
  );
};
