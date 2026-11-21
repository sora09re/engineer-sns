import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { HttpAppDeps } from "../http-app";
import { requireAccount } from "../middleware/require-account";
import { toUserResponse } from "../responses";

const userValuesSchema = z.object({
	name: z.string(),
	username: z.string(),
	email: z.string(),
	bio: z.string().optional(),
	location: z.string().optional(),
	website: z.string().optional(),
	profile_image_url: z.string().optional(),
});

const invalidBody = () => {
	return new HTTPException(422, { message: "入力の形式が正しくありません。" });
};

const registerBody = zValidator("json", userValuesSchema, (result) => {
	if (!result.success) {
		throw invalidBody();
	}
});

const updateBody = zValidator("json", userValuesSchema.partial(), (result) => {
	if (!result.success) {
		throw invalidBody();
	}
});

const profileImageBody = zValidator(
	"json",
	z.object({ content_type: z.string(), size: z.number() }),
	(result) => {
		if (!result.success) {
			throw invalidBody();
		}
	},
);

const toUserValues = <T extends { profile_image_url?: string }>({
	profile_image_url,
	...rest
}: T) => {
	return { ...rest, profileImageUrl: profile_image_url };
};

export const meRoutes = ({ verifyAccessToken, useCases }: HttpAppDeps) => {
	const auth = requireAccount(verifyAccessToken);
	return new Hono()
		.get("/", auth, async (c) => {
			const user = await useCases.getCurrentUser(c.var.accountId);
			return c.json(user && toUserResponse(user));
		})
		.post("/", auth, registerBody, async (c) => {
			const user = await useCases.registerUser({
				accountId: c.var.accountId,
				values: toUserValues(c.req.valid("json")),
			});
			return c.json(toUserResponse(user), 201);
		})
		.patch("/", auth, updateBody, async (c) => {
			const user = await useCases.updateCurrentUser({
				accountId: c.var.accountId,
				values: toUserValues(c.req.valid("json")),
			});
			return c.json(toUserResponse(user));
		})
		.post("/profile-image", auth, profileImageBody, async (c) => {
			const { content_type, size } = c.req.valid("json");
			const target = await useCases.issueProfileImageUpload({
				accountId: c.var.accountId,
				contentType: content_type,
				size,
			});
			return c.json({ upload_url: target.uploadUrl, public_url: target.publicUrl }, 201);
		});
};
