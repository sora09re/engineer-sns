/**
 * ユースケースが投げるエラー。presentation がステータスコードに変換する。
 * message はそのまま利用者に見せる。
 */
export class ApplicationError extends Error {}

/** 入力がルールに合わない */
export class ValidationError extends ApplicationError {}

/** 対象が存在しない */
export class NotFoundError extends ApplicationError {}

/** その操作をする権限がない */
export class ForbiddenError extends ApplicationError {}
