import { createClient } from "@supabase/supabase-js";

/**
 * supabase-js のクライアント。ログイン（Supabase Auth）にだけ使う。データの読み書きは API（./http.ts）を通す。
 * src/api/ の外から import しないこと（docs/adr/0002 参照）。
 */
export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
	{
		auth: { flowType: "pkce" },
	},
);
