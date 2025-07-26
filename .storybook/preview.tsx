import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { rest } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { testPost1, testPost2, testPost3 } from "../src/test/testPost";
import { testUser1, testUser2, testUser3 } from "../src/test/testUser";

// Initialize MSW
initialize();

const mswHandlers = [
	rest.get("/api/current", (_, res, ctx) => {
		return res(ctx.status(200), ctx.json({ testUser1 }));
	}),
	rest.get("/users/followers", (_, res, ctx) => {
		return res(ctx.status(200), ctx.json([testUser2, testUser3]));
	}),
	rest.get("/users/following", (_, res, ctx) => {
		return res(ctx.status(200), ctx.json([testUser2, testUser3]));
	}),
	rest.get("/search/posts?query={query}", (_, res, ctx) => {
		return res(ctx.status(200), ctx.json([testPost1, testPost2, testPost3]));
	}),
	rest.get("/search/users?query={query}", (_, res, ctx) => {
		return res(ctx.status(200), ctx.json([testUser2, testUser3]));
	}),
];

const withProviders = (Story) => (
	<Provider>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Story />
		</MantineProvider>
	</Provider>
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
