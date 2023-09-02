import { Group, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect } from "react";

import type { UserProfile } from "@/components/Modal/EditProfileModal/EditProfileModal";

interface ImageUploadProps {
  setUserProfileImage: (newUserProfile: Partial<UserProfile>) => void;
  userProfileImage?: string;
}

export const ImageUpload = ({
  setUserProfileImage,
  userProfileImage,
}: ImageUploadProps) => {
  useEffect(() => {
    setUserProfileImage({ profile_image_url: userProfileImage });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileImage]);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    setUserProfileImage({ profile_image_url: fileUrl });
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      style={{ border: 0, height: 120, padding: 0, width: 120 }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{
          height: 120,
          pointerEvents: "none",
          width: 120,
        }}
      >
        <Dropzone.Idle>
          <Image
            src={userProfileImage}
            height="120"
            width="120"
            alt="Profile image"
            withPlaceholder
            style={{ cursor: "pointer" }}
          />
        </Dropzone.Idle>
      </Group>
    </Dropzone>
  );
};
