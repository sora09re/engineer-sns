import { z } from "zod";

const schema = z.object({
	DATABASE_URL: z.url(),
	SUPABASE_URL: z.url(),
	SUPABASE_SECRET_KEY: z.string().min(1),
});

export const readEnv = (source: Record<string, string | undefined> = process.env) => {
	const result = schema.safeParse(source);
	if (!result.success) {
		throw new Error(`API の環境変数が不正です: ${z.prettifyError(result.error)}`);
	}
	return result.data;
};
