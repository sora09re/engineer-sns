import { RecoilRoot } from "recoil";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { CommentModal } from "../src/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "../src/components/Modal/EditProfileModal/EditProfileModal";
import { PostModal } from "../src/components/Modal/PostModal/PostModal";
import { LoginModal } from "../src/components/Modal/LoginModal/LoginModal";
import { SignupModal } from "../src/components/Modal/SignupModal/SignupModal";
import { initialize, mswLoader } from "msw-storybook-addon";
import { testUser1, testUser2, testUser3 } from "../src/test/testUser";
import { testPost1, testPost2, testPost3 } from "../src/test/testPost";
import { rest } from "msw";

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
  <RecoilRoot>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <CommentModal />
      <PostModal />
      <LoginModal />
      <SignupModal />
      <EditProfileModal />
      <Story />
    </MantineProvider>
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
