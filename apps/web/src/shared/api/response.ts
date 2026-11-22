export type JsonResponse = { ok: boolean; status: number; json: () => Promise<unknown> };

export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

const toError = async (response: JsonResponse) => {
	const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
	if (typeof body?.message === "string") {
		return new ApiError(response.status, body.message);
	}
	return new Error(`API がエラーを返しました（${response.status}）。`);
};

export const parse = async <R extends JsonResponse>(
	response: R,
): Promise<Awaited<ReturnType<R["json"]>>> => {
	if (!response.ok) {
		throw await toError(response);
	}
	return (await response.json()) as Awaited<ReturnType<R["json"]>>;
};

export const ensureOk = async (response: JsonResponse): Promise<void> => {
	if (!response.ok) {
		throw await toError(response);
	}
};

export const parseOrNull = async <R extends JsonResponse>(
	response: R,
): Promise<Awaited<ReturnType<R["json"]>> | null> => {
	if (response.status === 404) {
		return null;
	}
	return parse(response);
};
