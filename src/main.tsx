import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@/global.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { onSignedOut } from "@/api/session";
import { queryClient, router } from "@/router";
import { theme } from "@/theme";

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
			<MantineProvider theme={theme}>
				<Notifications />
				<RouterProvider router={router} />
			</MantineProvider>
		</QueryClientProvider>
	</StrictMode>,
);
