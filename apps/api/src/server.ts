// ローカル開発と E2E 用のサーバー。apps/web の Vite が /api をここへ転送する
import { serve } from "@hono/node-server";

import { createAppFromEnv } from "./index";

/** 既定は 8787。E2E は開発中のサーバーとぶつからないよう API_PORT で別のポートにする */
const port = Number(process.env.API_PORT ?? 8787);

serve({ fetch: createAppFromEnv().fetch, port }, () => {
	console.log(`API: http://localhost:${port}/api`);
});
