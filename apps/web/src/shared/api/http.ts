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

type JsonResponse = { ok: boolean; status: number; json: () => Promise<unknown> };

const toError = async (response: JsonResponse) => {
	const body = (await response.json().catch(() => null)) as { message?: string } | null;
	return new Error(body?.message ?? `API がエラーを返しました（${response.status}）。`);
};

export const parse = async <R extends JsonResponse>(
	response: R,
): Promise<Awaited<ReturnType<R["json"]>>> => {
	if (!response.ok) {
		throw await toError(response);
	}
	return (await response.json()) as Awaited<ReturnType<R["json"]>>;
};

export const ensureOk = async (response: JsonResponse): Promise<void> => {
	if (!response.ok) {
		throw await toError(response);
	}
};

export const parseOrNull = async <R extends JsonResponse>(
	response: R,
): Promise<Awaited<ReturnType<R["json"]>> | null> => {
	if (response.status === 404) {
		return null;
	}
	return parse(response);
};
