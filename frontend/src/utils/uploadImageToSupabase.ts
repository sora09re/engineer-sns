import { supabase } from "@/utils/supabase";

export const uploadImageToSupabase = async (
  tempImage: string | null,
  userId: string
) => {
  if (!tempImage) {
    return null;
  }
  try {
    const response = await fetch(tempImage);
    const file = await response.blob();
    const filePath = `${userId}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("profile_image")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("profile_image")
      .getPublicUrl(filePath);
    const imageUrl = data?.publicUrl;
    if (!imageUrl) {
      throw new Error("Error getting public URL");
    }

    return imageUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};
