import type { AppType } from "@engineer-sns/api";
import { hc } from "hono/client";

import { supabase } from "./supabase";

export const api = hc<AppType>(window.location.origin, {
	headers: async (): Promise<Record<string, string>> => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session ? { Authorization: `Bearer ${session.access_token}` } : {};
	},
});
