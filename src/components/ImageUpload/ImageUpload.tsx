import { Group, Image } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

import { PROFILE_IMAGE_MIME_TYPES } from "@/api/users";

interface ImageUploadProps {
	imageUrl?: string;
	onDrop: (acceptedFiles: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onDrop }) => {
	return (
		<Dropzone
			onDrop={onDrop}
			maxSize={3 * 1024 ** 2}
			accept={PROFILE_IMAGE_MIME_TYPES}
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
						// React 19 は空文字の src を警告するので、画像がなければ null にしてプレースホルダーを出す
						src={imageUrl || null}
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
