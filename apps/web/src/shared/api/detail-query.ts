import { type QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { notFound, rootRouteId } from "@tanstack/react-router";

import { type JsonResponse, parseOrNull } from "./response";

interface DetailQueryOptions<R extends JsonResponse> {
	queryKey: (id: string) => readonly unknown[];
	request: (id: string) => Promise<R>;
}

export const defineDetailQuery = <R extends JsonResponse>({
	queryKey,
	request,
}: DetailQueryOptions<R>) => {
	type Data = Awaited<ReturnType<R["json"]>>;

	const query = (id: string) => {
		return queryOptions({
			queryKey: queryKey(id),
			queryFn: async (): Promise<Data | null> => parseOrNull(await request(id)),
		});
	};

	const found = (data: Data | null): Data => {
		if (data === null) {
			throw notFound({ routeId: rootRouteId });
		}
		return data;
	};

	return {
		query,
		load: async (queryClient: QueryClient, id: string): Promise<Data> => {
			return found(await queryClient.ensureQueryData(query(id)));
		},
		useData: (id: string): Data => {
			const { data } = useSuspenseQuery(query(id));
			return found(data);
		},
	};
};
