import { assertCanWrite } from "./assert-can-write";
import type { PostQuery, PostRepository, UserRepository } from "./ports";
import type { PostSummary } from "./post-summary";

/** 投稿する。投稿者は常にログイン中のアカウントのユーザー */
export const createPost = (deps: {
	users: UserRepository;
	postRepository: PostRepository;
	posts: PostQuery;
}) => {
	return async (input: { accountId: string; content: string }): Promise<PostSummary> => {
		await assertCanWrite(deps.users, input);
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
