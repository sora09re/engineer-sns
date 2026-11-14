import { Hono } from "hono";

import type { GetTimeline } from "../../application/get-timeline";
import type { AccessTokenVerifier } from "../../application/ports";
import { requireAccount } from "../middleware/require-account";
import { toPostType } from "../responses/post-type";

export const postsRoutes = (deps: {
	verifyAccessToken: AccessTokenVerifier;
	getTimeline: GetTimeline;
}) => {
	return new Hono().get("/timeline", requireAccount(deps.verifyAccessToken), async (c) => {
		const timeline = await deps.getTimeline(c.var.accountId);
		return c.json(timeline.map(toPostType));
	});
};
