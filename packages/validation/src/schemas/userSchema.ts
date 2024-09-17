import { z } from "zod";

const uuidErrorMessage = "無効なユーザーIDの形式です。";

export const userIdSchema = z.string().uuid(uuidErrorMessage);

export const currentUserIdSchema = z.string().uuid(uuidErrorMessage);

export const getUserInputSchema = z.object({
  userId: z.string().uuid(uuidErrorMessage),
});
