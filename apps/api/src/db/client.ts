import type { PgDatabase } from "drizzle-orm/pg-core";
import { drizzle, type PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/** API が使う DB。テストではトランザクションを渡すので、トランザクションも受けられる型にする */
export type Db = PgDatabase<PostgresJsQueryResultHKT, typeof schema>;

export const connect = (url: string) => {
	// Supavisor のトランザクションモードはプリペアドステートメントに対応していない
	const client = postgres(url, { prepare: false });
	return { db: drizzle(client, { schema }), close: () => client.end() };
};
