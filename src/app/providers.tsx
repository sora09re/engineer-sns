"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";

type Props = {
	children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	return (
		<SessionProvider>
			<Provider>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<Notifications />
					{children}
				</MantineProvider>
			</Provider>
		</SessionProvider>
	);
};
