import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "jotai";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { CustomAppPage } from "next/app";

const App: CustomAppPage<{ session: Session | null | undefined }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Provider>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<Notifications />
					<Component {...pageProps} />
				</MantineProvider>
			</Provider>
		</SessionProvider>
	);
};

export default App;
