/**
 * application が外側（infrastructure）に求めるもの。実装は infrastructure に置き、app.ts で組み立てる。
 */
import type { PostSummary } from "./post-summary";

export type FollowRepository = {
	/** followerId のユーザーがフォローしているユーザー（followee）の ID */
	findFolloweeIds: (followerId: string) => Promise<string[]>;
};

export type PostQuery = {
	/** authorIds のユーザーが書いた、コメントでない投稿を新しい順に返す */
	findTopLevelByAuthors: (authorIds: string[]) => Promise<PostSummary[]>;
};

/** アクセストークンを検証し、アカウント ID を返す。不正なら null */
export type AccessTokenVerifier = (token: string) => Promise<{ accountId: string } | null>;
