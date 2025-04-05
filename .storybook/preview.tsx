import { MantineProvider } from "@mantine/core";
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { RecoilRoot } from "recoil";
import { testPost1, testPost2, testPost3 } from "../src/test/testPost";
import { testUser1, testUser2, testUser3 } from "../src/test/testUser";

// Initialize MSW
initialize();

const mswHandlers = [
	http.get("/api/current", () => {
		return HttpResponse.json({ testUser1 });
	}),
	http.get("/users/followers", () => {
		return HttpResponse.json([testUser2, testUser3]);
	}),
	http.get("/users/following", () => {
		return HttpResponse.json([testUser2, testUser3]);
	}),
	http.get("/search/posts?query={query}", () => {
		return HttpResponse.json([testPost1, testPost2, testPost3]);
	}),
	http.get("/search/users?query={query}", () => {
		return HttpResponse.json([testUser2, testUser3]);
	}),
];

const mockSession: Session = {
	user: {
		name: "John Doe",
	},
	expires: "2025-12-31T23:59:59.999Z",
};

const withProviders = (Story) => (
	<RecoilRoot>
		<SessionProvider session={mockSession}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<Story />
			</MantineProvider>
		</SessionProvider>
	</RecoilRoot>
);

const preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		msw: {
			handlers: mswHandlers,
		},
	},
	decorators: [withProviders],
	loaders: [mswLoader],
};

export default preview;
