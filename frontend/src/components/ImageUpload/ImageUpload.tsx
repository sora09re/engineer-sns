import { Group, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

interface ImageUploadProps {
  imageUrl?: string;
  onDrop: (acceptedFiles: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUrl,
  onDrop,
}) => {
  return (
    <Dropzone
      onDrop={onDrop}
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
