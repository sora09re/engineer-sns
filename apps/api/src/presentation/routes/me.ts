import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { GetCurrentUser } from "../../application/get-current-user";
import type { IssueProfileImageUpload } from "../../application/issue-profile-image-upload";
import type { AccessTokenVerifier } from "../../application/ports";
import type { RegisterUser } from "../../application/register-user";
import type { UpdateCurrentUser } from "../../application/update-current-user";
import { requireAccount } from "../middleware/require-account";
import { toUserResponse } from "../responses/post-type";

/** packages/shared の UserValues の形。中身のルール（空でないかなど）は application で確かめる */
const userValuesSchema = z.object({
	name: z.string(),
	username: z.string(),
	email: z.string(),
	bio: z.string().optional(),
	location: z.string().optional(),
	website: z.string().optional(),
	profile_image_url: z.string().optional(),
});

/** 項目の型が違うなど形が不正なら 422 にする（JSON として読めなければ Hono が 400 にする） */
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

/** API の項目名（snake_case）を domain の項目名にする */
const toUserValues = <T extends { profile_image_url?: string }>({
	profile_image_url,
	...rest
}: T) => {
	return { ...rest, profileImageUrl: profile_image_url };
};

/** ログイン中のアカウントのユーザー */
export const meRoutes = (deps: {
	verifyAccessToken: AccessTokenVerifier;
	getCurrentUser: GetCurrentUser;
	registerUser: RegisterUser;
	updateCurrentUser: UpdateCurrentUser;
	issueProfileImageUpload: IssueProfileImageUpload;
}) => {
	const auth = requireAccount(deps.verifyAccessToken);
	return new Hono()
		.get("/", auth, async (c) => {
			const user = await deps.getCurrentUser(c.var.accountId);
			return c.json(user && toUserResponse(user));
		})
		.post("/", auth, registerBody, async (c) => {
			const user = await deps.registerUser({
				accountId: c.var.accountId,
				values: toUserValues(c.req.valid("json")),
			});
			return c.json(toUserResponse(user), 201);
		})
		.patch("/", auth, updateBody, async (c) => {
			const user = await deps.updateCurrentUser({
				accountId: c.var.accountId,
				values: toUserValues(c.req.valid("json")),
			});
			return c.json(toUserResponse(user));
		})
		.post("/profile-image", auth, profileImageBody, async (c) => {
			const { content_type, size } = c.req.valid("json");
			const target = await deps.issueProfileImageUpload({
				accountId: c.var.accountId,
				contentType: content_type,
				size,
			});
			return c.json({ upload_url: target.uploadUrl, public_url: target.publicUrl }, 201);
		});
};
