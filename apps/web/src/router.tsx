import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { CenteredLoader } from "@/components/CenteredLoader/CenteredLoader";
import { ErrorView } from "@/components/ErrorView/ErrorView";
import { routeTree } from "@/routeTree.gen";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// loader で取得した直後にコンポーネントが再取得しないようにする
			staleTime: 30_000,
		},
	},
	queryCache: new QueryCache({
		onError: () => {
			notifications.show({
				id: "query-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "データの取得に失敗しました。",
				title: "エラー",
			});
		},
	}),
});

export const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultPreload: "intent",
	// プリロードの鮮度は TanStack Query に任せる
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: CenteredLoader,
	defaultErrorComponent: ErrorView,
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
