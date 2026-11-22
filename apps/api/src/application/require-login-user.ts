import type { Post } from "../domain/post";
import { ForbiddenError, NotFoundError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";

type PostAuthorization = {
	allows: (post: Post, accountId: string) => boolean;
	message: string;
};

type Operator = { by: "loginUser" } | { by: "account" };

type PostOperator = { by: "loginUser"; authorization?: PostAuthorization } | { by: "account" };

const assertLoginUser = async (users: UserRepository, accountId: string, operator: Operator) => {
	if (operator.by === "loginUser" && !(await users.exists(accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
};

export const requireLoginUser = async (
	deps: { users: UserRepository },
	input: { accountId: string },
): Promise<void> => {
	await assertLoginUser(deps.users, input.accountId, { by: "loginUser" });
};

export const requirePost = async (
	deps: { users: UserRepository; posts: PostRepository },
	input: { accountId: string; postId: string },
	operator: PostOperator,
): Promise<Post> => {
	await assertLoginUser(deps.users, input.accountId, operator);
	const post = await deps.posts.findById(input.postId);
	if (!post) {
		throw new NotFoundError("投稿が見つかりません。");
	}
	if (
		operator.by === "loginUser" &&
		operator.authorization &&
		!operator.authorization.allows(post, input.accountId)
	) {
		throw new ForbiddenError(operator.authorization.message);
	}
	return post;
};

export const requireTargetUser = async (
	deps: { users: UserRepository },
	input: { accountId: string; userId: string },
	operator: Operator,
): Promise<void> => {
	await assertLoginUser(deps.users, input.accountId, operator);
	if (!(await deps.users.exists(input.userId))) {
		throw new NotFoundError("ユーザーが見つかりません。");
	}
};
