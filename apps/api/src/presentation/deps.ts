import type { AccessTokenVerifier } from "../application/ports";
import type { UseCases } from "../application/use-cases";

/** HTTP の入口が受け取るもの。アクセストークンの検証はユースケースではないので分けて渡す */
export type HttpAppDeps = {
	verifyAccessToken: AccessTokenVerifier;
	useCases: UseCases;
};
