/** 投稿: ユーザーが書いたコードスニペットを含むテキスト。parentPostId を持つものはコメント */
export type Post = {
	id: string;
	authorId: string;
	parentPostId: string | null;
	content: string;
	createdAt: Date;
};
