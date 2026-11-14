import type { Post } from "../domain/post";
import { NotFoundError } from "./errors";
import type { PostRepository } from "./ports";

/** 投稿を取る。なければ NotFoundError */
export const requirePost = async (
	postRepository: PostRepository,
	postId: string,
): Promise<Post> => {
	const post = await postRepository.findById(postId);
	if (!post) {
		throw new NotFoundError("投稿が見つかりません。");
	}
	return post;
};
