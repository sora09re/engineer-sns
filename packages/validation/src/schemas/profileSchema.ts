import { z } from "zod";

export const profileUpdateSchema = z.object({
  id: z.string().min(1, { message: "IDは必須です。" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" })
    .min(1, { message: "メールアドレスは必須です。" }),
  bio: z.string().optional(),
  location: z.string().optional(),
  name: z.string().min(1, { message: "名前は必須です。" }),
  profileImageUrl: z.string().url({ message: "有効なURLを入力してください。" }).optional(),
  username: z.string().min(1, { message: "ユーザー名は必須です。" }),
  website: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
