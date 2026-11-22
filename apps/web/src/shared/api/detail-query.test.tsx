import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRouteWithContext,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { defineDetailQuery } from "./detail-query";

const response = (status: number, body: unknown) => {
	return { ok: status < 400, status, json: async () => body as { name: string } };
};

const setup = (initial: Record<string, { name: string } | undefined>) => {
	const items = { ...initial };
	const itemDetail = defineDetailQuery({
		queryKey: (id) => ["items", id],
		request: async (id) => {
			const item = items[id];
			return item ? response(200, item) : response(404, { message: "not found" });
		},
	});

	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
		component: () => (
			<>
				<p>layout</p>
				<Outlet />
			</>
		),
		notFoundComponent: () => <p>見つかりません</p>,
	});
	const ItemPage = () => {
		const { id } = itemRoute.useParams();
		const item = itemDetail.useData(id);
		return <p>{item.name}</p>;
	};
	const itemRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/items/$id",
		loader: ({ context, params }) => itemDetail.load(context.queryClient, params.id),
		component: ItemPage,
	});
	const router = createRouter({
		routeTree: rootRoute.addChildren([itemRoute]),
		context: { queryClient },
		defaultErrorComponent: () => <p>エラー</p>,
		history: createMemoryHistory({ initialEntries: ["/items/1"] }),
	});

	render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);

	return { items, queryClient, itemDetail };
};

describe("defineDetailQuery", () => {
	it("見つかったら、その値をページに渡す", async () => {
		setup({ "1": { name: "item 1" } });

		expect(await screen.findByText("item 1")).toBeInTheDocument();
	});

	it("開く前に 404 なら、見つからないと表示する", async () => {
		setup({});

		expect(await screen.findByText("見つかりません")).toBeInTheDocument();
	});

	it("開いたあとに取り直して 404 になったら、見つからないと表示する", async () => {
		const { items, queryClient, itemDetail } = setup({ "1": { name: "item 1" } });
		await screen.findByText("item 1");

		delete items["1"];
		await act(() => queryClient.refetchQueries({ queryKey: itemDetail.query("1").queryKey }));

		expect(await screen.findByText("見つかりません")).toBeInTheDocument();
	});
});
