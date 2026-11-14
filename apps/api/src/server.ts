// ローカル開発用のサーバー。apps/web の Vite が /api をここへ転送する
import { serve } from "@hono/node-server";

import { createAppFromEnv } from "./index";

const port = 8787;

serve({ fetch: createAppFromEnv().fetch, port }, () => {
	console.log(`API: http://localhost:${port}/api`);
});
