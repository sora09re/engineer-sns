import { Group, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (base64: string) => void;
  value?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
}) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (files: any) => {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
      };

      reader.readAsDataURL(file);
    },
    [handleChange]
  );

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
            src={base64}
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
