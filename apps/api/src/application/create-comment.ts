import { assertCanWrite } from "./assert-can-write";
import { NotFoundError } from "./errors";
import type { PostQuery, PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";

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
		await assertCanWrite(deps.users, input);
		const parent = await deps.postRepository.findById(input.postId);
		if (!parent) {
			throw new NotFoundError("投稿が見つかりません。");
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
