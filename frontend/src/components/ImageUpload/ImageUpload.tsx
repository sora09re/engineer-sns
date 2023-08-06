import { Group, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean;
  image_url?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ image_url }) => {
  const [imageUrl, setImageUrl] = useState(image_url);

  useEffect(() => {
    setImageUrl(image_url);
  }, [image_url]);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    setImageUrl(fileUrl);
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
            src={imageUrl}
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
