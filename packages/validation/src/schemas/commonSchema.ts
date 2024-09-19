import { z } from "zod";

export const uuidErrorMessage = "無効なユーザーIDの形式です。";

export const userIdSchema = z.string().uuid(uuidErrorMessage);

export const currentUserIdSchema = z.string().uuid(uuidErrorMessage);
