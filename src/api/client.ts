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

type Result = { data: unknown; error: unknown };

/** エラーなら投げる（insert / update / delete 用） */
export const throwIfError = ({ error }: { error: unknown }) => {
	if (error) {
		throw error;
	}
};

/** エラーなら投げ、data を返す（select 用） */
export const unwrap = <R extends Result>(result: R): NonNullable<R["data"]> => {
	throwIfError(result);
	if (result.data === null || result.data === undefined) {
		throw new Error("データが取得できませんでした。");
	}
	return result.data as NonNullable<R["data"]>;
};

/** maybeSingle() 用。行がなければ null */
export const unwrapMaybe = <R extends Result>(result: R): R["data"] => {
	throwIfError(result);
	return result.data;
};

/**
 * 埋め込みの count 集計 (`rel(count)`) の値を取り出す。
 * 実行時は [{ count }] の配列で返るが、自己参照などで型推論が単体になる場合があるので両方を受ける。
 */
export const countOf = (value: { count: number }[] | { count: number } | null): number => {
	if (!value) {
		return 0;
	}
	return Array.isArray(value) ? (value[0]?.count ?? 0) : value.count;
};

/**
 * PostgREST の or() フィルタに埋め込む ilike パターンを作る。
 * カンマや括弧で構文が壊れないよう、値をダブルクォートで囲む。
 */
export const ilikePattern = (keyword: string) => {
	const escaped = keyword.replace(/[\\%_]/g, (c) => `\\${c}`).replace(/"/g, '\\"');
	return `"%${escaped}%"`;
};
