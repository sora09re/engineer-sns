import { z } from "zod";

export const searchInputSchema = z.object({
  keyword: z.string().min(1, "キーワードは必須です。"),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
