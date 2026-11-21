export type Post = {
	id: string;
	authorId: string;
	parentPostId: string | null;
	content: string;
	createdAt: Date;
};

export const isValidPostContent = (content: string) => {
	return content.trim().length > 0;
};

export const canDeletePost = (post: Post, accountId: string) => {
	return post.authorId === accountId;
};
