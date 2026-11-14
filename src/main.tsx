import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Provider } from "jotai";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { onSignedOut } from "@/api/session";
import { queryClient, router } from "@/router";

onSignedOut(() => {
	queryClient.clear();
	void router.invalidate();
});

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("#root が見つかりません。");
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<Notifications />
					<RouterProvider router={router} />
				</MantineProvider>
			</Provider>
		</QueryClientProvider>
	</StrictMode>,
);
