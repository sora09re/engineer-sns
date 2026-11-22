export type Post = {
	id: string;
	authorId: string;
	parentPostId: string | null;
	content: string;
	createdAt: Date;
};

export { isValidPostContent } from "@engineer-sns/shared/rules";

export const canDeletePost = (post: Post, accountId: string) => {
	return post.authorId === accountId;
};
