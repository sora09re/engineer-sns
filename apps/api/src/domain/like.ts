/** いいね: ユーザーが投稿に付ける評価。1 ユーザーにつき 1 投稿あたり 1 つ */
export type Like = {
	id: string;
	postId: string;
	userId: string;
};
