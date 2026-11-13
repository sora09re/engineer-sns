import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

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

/**
 * 最も深いルートの head().meta.title を document.title に反映する。
 * React 18 は <title> を <head> へ巻き上げないため、HeadContent の代わりに使う。
 * TODO: React 19 に上げたら、このフックを消して RootComponent で <HeadContent /> を描画する。
 */
const useDocumentTitle = () => {
	const title = useRouterState({
		select: (state) => {
			return state.matches.flatMap((match) => match.meta ?? []).findLast((meta) => meta?.title)
				?.title;
		},
	});

	useEffect(() => {
		if (title) {
			document.title = title;
		}
	}, [title]);
};

function RootComponent() {
	useDocumentTitle();
	return <Outlet />;
}
