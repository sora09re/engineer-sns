import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * supabase-js のクライアント。src/api/ の外から import しないこと（docs/adr/0001 参照）。
 */
export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
	{
		auth: { flowType: "pkce" },
	},
);
