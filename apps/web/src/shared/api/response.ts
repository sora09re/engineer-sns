export type JsonResponse = { ok: boolean; status: number; json: () => Promise<unknown> };

const toError = async (response: JsonResponse) => {
	const body = (await response.json().catch(() => null)) as { message?: string } | null;
	return new Error(body?.message ?? `API がエラーを返しました（${response.status}）。`);
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
