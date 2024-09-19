import { z } from "zod";

export const profileUpdateSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email is required" }),
  bio: z.string().optional(),
  location: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  profileImageUrl: z.string().url().optional(),
  username: z.string().min(1, { message: "Username is required" }),
  website: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
