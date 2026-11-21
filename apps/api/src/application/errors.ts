export class ApplicationError extends Error {}

export class ValidationError extends ApplicationError {}

export class NotFoundError extends ApplicationError {}

export class ForbiddenError extends ApplicationError {}

export class ConflictError extends ApplicationError {}
