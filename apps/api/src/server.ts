import { serve } from "@hono/node-server";

import { createAppFromEnv } from "./index";

const port = Number(process.env.API_PORT ?? 8787);

serve({ fetch: createAppFromEnv().fetch, port }, () => {
	console.log(`API: http://localhost:${port}/api`);
});
