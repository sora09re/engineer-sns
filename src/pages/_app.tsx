import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { CustomAppPage } from "next/app";
import { RecoilRoot } from "recoil";

const App: CustomAppPage<{ session: Session | null | undefined }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<RecoilRoot>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<Notifications />
					<Component {...pageProps} />
				</MantineProvider>
			</RecoilRoot>
		</SessionProvider>
	);
};

export default App;
