import type { Post } from "../domain/post";
import { ForbiddenError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";
import { requirePost } from "./require-post";
import { requireTargetUser } from "./require-target-user";

/**
 * ログイン中のユーザーとして何かを作る操作の前提。確かめる順番はどの操作でも同じで、
 * 1. アカウントがユーザーを持っていなければ ForbiddenError（新規ユーザー登録の前はできない）
 * 2. 対象（postId の投稿、userId のユーザー）がなければ NotFoundError
 * 入力のルール（本文が空でないかなど）は、呼ぶ側がこの後で確かめる。
 * 対象が投稿なら、その投稿を返す
 */
export async function requireLoginUser(
	deps: { users: UserRepository; postRepository: PostRepository },
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
	deps: { users: UserRepository; postRepository?: PostRepository },
	input: { accountId: string; postId?: string; userId?: string },
): Promise<Post | void> {
	if (!(await deps.users.exists(input.accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
	if (input.userId !== undefined) {
		await requireTargetUser(deps.users, input.userId);
	}
	if (input.postId !== undefined) {
		return requirePost(deps.postRepository!, input.postId);
	}
}
