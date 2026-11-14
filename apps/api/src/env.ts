import { z } from "zod";

const schema = z.object({
	/** 本番は Supavisor のトランザクションモード（ポート 6543）の接続文字列 */
	DATABASE_URL: z.url(),
	/** Supabase のプロジェクトの URL。アクセストークンの検証に使う JWKS をここから取る */
	SUPABASE_URL: z.url(),
});

export const readEnv = (source: Record<string, string | undefined> = process.env) => {
	const result = schema.safeParse(source);
	if (!result.success) {
		throw new Error(`API の環境変数が不正です: ${z.prettifyError(result.error)}`);
	}
	return result.data;
};
