import { z } from "zod";

const uuid = z.guid();

/**
 * 投稿とユーザーの ID は Postgres の uuid 型。UUID の形をしていない文字列を渡すと DB がエラーにするので、
 * 外から来た ID は問い合わせる前にこれで確かめ、形が違えば「見つからない」として扱う
 */
export const isUuid = (value: string) => {
	return uuid.safeParse(value).success;
};
