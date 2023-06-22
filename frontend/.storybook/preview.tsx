import { RecoilRoot } from "recoil";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { CommentModal } from "../src/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "../src/components/Modal/EditProfileModal/EditProfileModal";
import { PostModal } from "../src/components/Modal/PostModal/PostModal";
import { initialize, mswDecorator, mswLoader } from "msw-storybook-addon";
import { rest } from "msw";

export const decorators = [mswDecorator];

initialize();

export const parameters = {
  msw: {
    handlers: [
      rest.get("/api/current", async (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            bio: "フロントエンドエンジニア。TypeScriptとNextに興味があります。",
            location: "Tokyo, Japan",
            name: "TaroYamada",
            profileImageUrl: "/__mocks__/images/img01.png",
            username: "@taro_yamada",
            website: "https://taro_yamada.com",
          })
        );
      }),
    ],
  },
};

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <RecoilRoot>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <CommentModal />
          <PostModal />
          <EditProfileModal />
          <Story />
        </MantineProvider>
      </RecoilRoot>
    ),
  ],
  loaders: [mswLoader],
};

export default preview;
