import { z } from "zod";
import { uuidErrorMessage } from "./commonSchema";

export const getUserInputSchema = z.object({
  userId: z.string().uuid(uuidErrorMessage),
});
