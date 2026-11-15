import { isValidPostContent } from "../domain/post";
import { ValidationError } from "./errors";
import type { PostQuery, PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";
import { requireLoginUser } from "./require-login-user";

/** 投稿にコメントする。コメントは parentPostId を持つ投稿 */
export const createComment = (deps: {
	users: UserRepository;
	postRepository: PostRepository;
	posts: PostQuery;
}) => {
	return async (input: {
		accountId: string;
		postId: string;
		content: string;
	}): Promise<PostSummary> => {
		const parent = await requireLoginUser(deps, {
			accountId: input.accountId,
			postId: input.postId,
		});
		if (!isValidPostContent(input.content)) {
			throw new ValidationError("本文を入力してください。");
		}
		const comment = await deps.postRepository.create({
			authorId: input.accountId,
			content: input.content,
			parentPostId: parent.id,
		});
		const summary = await deps.posts.findById(comment.id);
		if (!summary) {
			throw new Error(`作成したコメント（${comment.id}）が見つかりません。`);
		}
		return summary;
	};
};

export type CreateComment = ReturnType<typeof createComment>;
