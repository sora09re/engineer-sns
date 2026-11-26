import { canDeletePost, type Post } from "../domain/post";
import { ForbiddenError, NotFoundError } from "./errors";
import type { PostRepository, UserRepository } from "./ports";

export const requireLoginUser = async (
	deps: { users: UserRepository },
	input: { accountId: string },
): Promise<void> => {
	if (!(await deps.users.exists(input.accountId))) {
		throw new ForbiddenError("新規ユーザー登録が済んでいません。");
	}
};

export const requirePostEvenWithoutUser = async (
	deps: { posts: PostRepository },
	input: { postId: string },
): Promise<Post> => {
	const post = await deps.posts.findById(input.postId);
	if (!post) {
		throw new NotFoundError("投稿が見つかりません。");
	}
	return post;
};

export const requireTargetUserEvenWithoutUser = async (
	deps: { users: UserRepository },
	input: { userId: string },
): Promise<void> => {
	if (!(await deps.users.exists(input.userId))) {
		throw new NotFoundError("ユーザーが見つかりません。");
	}
};

export const requirePost = async (
	deps: { users: UserRepository; posts: PostRepository },
	input: { accountId: string; postId: string },
): Promise<Post> => {
	await requireLoginUser(deps, input);
	return requirePostEvenWithoutUser(deps, input);
};

export const requireDeletablePost = async (
	deps: { users: UserRepository; posts: PostRepository },
	input: { accountId: string; postId: string },
): Promise<Post> => {
	const post = await requirePost(deps, input);
	if (!canDeletePost(post, input.accountId)) {
		throw new ForbiddenError("この投稿は削除できません。");
	}
	return post;
};

export const requireTargetUser = async (
	deps: { users: UserRepository },
	input: { accountId: string; userId: string },
): Promise<void> => {
	await requireLoginUser(deps, input);
	await requireTargetUserEvenWithoutUser(deps, input);
};
