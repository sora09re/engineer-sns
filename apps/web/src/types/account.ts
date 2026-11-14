/** アカウント: GitHub でログインした認証上の主体。ユーザーを持たない場合がある */
export type Account = {
	id: string;
	email?: string;
	name?: string;
	avatarUrl?: string;
};
