/**
 * クエリキーの先頭の要素。更新後はこの単位（"users" / "posts" / "follows"）で無効化する。
 */
export const queryKeys = {
	users: ["users"] as const,
	posts: ["posts"] as const,
	follows: ["follows"] as const,
};
