import { Center, Group, Image } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

import { PROFILE_IMAGE_MIME_TYPES } from "@/api/users";

interface ImageUploadProps {
	imageUrl?: string;
	onDrop: (acceptedFiles: File[]) => void;
}

/** Mantine 6 の Image（withPlaceholder）が出していたプレースホルダーのアイコン */
const PlaceholderIcon = () => {
	return (
		// v6 ではアイコンが中央より 3px 上にあった
		<svg
			viewBox="0 0 15 15"
			fill="none"
			width={40}
			height={40}
			style={{ marginTop: -6 }}
			aria-hidden
		>
			<path
				d="M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			/>
		</svg>
	);
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onDrop }) => {
	return (
		<Dropzone
			onDrop={onDrop}
			maxSize={3 * 1024 ** 2}
			accept={PROFILE_IMAGE_MIME_TYPES}
			style={{ border: 0, height: 120, padding: 0, width: 120 }}
		>
			<Group
				justify="center"
				gap="xl"
				style={{
					height: 120,
					pointerEvents: "none",
					width: 120,
				}}
			>
				<Dropzone.Idle>
					{/* Mantine 7 で Image の withPlaceholder は廃止されたので、画像がないときは v6 と同じプレースホルダーを自前で出す */}
					{imageUrl ? (
						<Image
							src={imageUrl}
							h={120}
							w={120}
							alt="Profile image"
							style={{ cursor: "pointer" }}
						/>
					) : (
						<Center h={120} w={120} bg="gray.0" c="gray.6" style={{ cursor: "pointer" }}>
							<PlaceholderIcon />
						</Center>
					)}
				</Dropzone.Idle>
			</Group>
		</Dropzone>
	);
};
