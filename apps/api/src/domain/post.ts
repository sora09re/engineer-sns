/** 投稿: ユーザーが書いたコードスニペットを含むテキスト。parentPostId を持つものはコメント */
export type Post = {
	id: string;
	authorId: string;
	parentPostId: string | null;
	content: string;
	createdAt: Date;
};

/** 投稿の本文として受け付けられるか。空白（改行・タブを含む）だけの本文は投稿にならない */
export const isValidPostContent = (content: string) => {
	return content.trim().length > 0;
};

/** 投稿を削除できるのは投稿者だけ */
export const canDeletePost = (post: Post, accountId: string) => {
	return post.authorId === accountId;
};
