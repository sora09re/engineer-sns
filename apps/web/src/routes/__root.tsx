import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";

import { NotFoundView } from "@/components/NotFoundView/NotFoundView";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [{ title: "Engineer-SNS" }],
	}),
	component: RootComponent,
	notFoundComponent: NotFoundView,
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
		</>
	);
}
