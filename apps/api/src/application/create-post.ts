import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostQuery, PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";
import { requireLoginUser } from "./require-login-user";

/** 投稿する。投稿者は常にログイン中のアカウントのユーザー */
export const createPost = (deps: {
	users: UserRepository;
	postRepository: PostRepository;
	posts: PostQuery;
}) => {
	return async (input: { accountId: string; content: string }): Promise<PostSummary> => {
		await requireLoginUser(deps, { accountId: input.accountId });
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		const post = await deps.postRepository.create({
			authorId: input.accountId,
			content: input.content,
		});
		const summary = await deps.posts.findById(post.id);
		if (!summary) {
			throw new Error(`作成した投稿（${post.id}）が見つかりません。`);
		}
		return summary;
	};
};

export type CreatePost = ReturnType<typeof createPost>;
