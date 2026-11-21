import type { Post } from "../domain/post";
import { ForbiddenError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-post";
import { requireTargetUser } from "./require-target-user";

export async function requireLoginUser(
	deps: { users: UserRepository; posts: PostRepository },
	input: { accountId: string; postId: string },
): Promise<Post>;
export async function requireLoginUser(
	deps: { users: UserRepository },
	input: { accountId: string; userId: string },
): Promise<void>;
export async function requireLoginUser(
	deps: { users: UserRepository },
	input: { accountId: string },
): Promise<void>;
export async function requireLoginUser(
	deps: { users: UserRepository; posts?: PostRepository },
	input: { accountId: string; postId?: string; userId?: string },
): Promise<Post | void> {
	if (!(await deps.users.exists(input.accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
	if (input.userId !== undefined) {
		await requireTargetUser(deps.users, input.userId);
	}
	if (input.postId !== undefined) {
		return requirePost(deps.posts!, input.postId);
	}
}
