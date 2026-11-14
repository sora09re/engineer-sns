import type { AppType } from "@engineer-sns/api";
import { hc } from "hono/client";

import { supabase } from "./client";

/**
 * API サーバー（apps/api）のクライアント。src/api/ の外から import しないこと（docs/adr/0002 参照）。
 * 同一オリジンの /api に届く（開発中は Vite が apps/api へ転送する）。
 */
export const api = hc<AppType>(window.location.origin, {
	headers: async (): Promise<Record<string, string>> => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session ? { Authorization: `Bearer ${session.access_token}` } : {};
	},
});

type JsonResponse = { ok: boolean; status: number; json: () => Promise<unknown> };

/** 失敗なら API の message で例外を投げ、成功なら本文を返す */
export const parse = async <R extends JsonResponse>(
	response: R,
): Promise<Awaited<ReturnType<R["json"]>>> => {
	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { message?: string } | null;
		throw new Error(body?.message ?? `API がエラーを返しました（${response.status}）。`);
	}
	return (await response.json()) as Awaited<ReturnType<R["json"]>>;
};
