import { useEffect, useState } from "react";

/** ドロップされた画像ファイルとプレビュー用 URL */
export const useImageFile = () => {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!imageFile) {
			setPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(imageFile);
		setPreviewUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [imageFile]);

	const selectImage = (files: File[]) => {
		setImageFile(files[0] ?? null);
	};

	const clearImage = () => {
		setImageFile(null);
	};

	return { clearImage, imageFile, previewUrl, selectImage };
};
