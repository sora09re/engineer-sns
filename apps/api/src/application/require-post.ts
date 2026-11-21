import type { Post } from "../domain/post";
import { NotFoundError } from "./errors";
import type { PostRepository } from "./ports";

export const requirePost = async (posts: PostRepository, postId: string): Promise<Post> => {
	const post = await posts.findById(postId);
	if (!post) {
		throw new NotFoundError("投稿が見つかりません。");
	}
	return post;
};
