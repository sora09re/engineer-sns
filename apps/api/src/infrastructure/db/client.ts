import type { PgDatabase } from "drizzle-orm/pg-core";
import { drizzle, type PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export type Db = PgDatabase<PostgresJsQueryResultHKT, typeof schema>;

export const connect = (url: string) => {
	const client = postgres(url, { prepare: false });
	return { db: drizzle(client, { schema }), close: () => client.end() };
};
