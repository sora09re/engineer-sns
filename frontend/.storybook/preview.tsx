import { RecoilRoot } from "recoil";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { CommentModal } from "../src/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "../src/components/Modal/EditProfileModal/EditProfileModal";
import { PostModal } from "../src/components/Modal/PostModal/PostModal";
import { initialize, mswLoader } from "msw-storybook-addon";
import { rest } from "msw";

// Initialize MSW
initialize();

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
      handlers: [
        rest.get("/api/current", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              bio: "フロントエンドエンジニア。TypeScriptとNextに興味があります。",
              location: "Tokyo, Japan",
              email: "takuro_sato@example.com",
              followerCount: 3421,
              followingCount: 3143,
              name: "TaroYamada",
              profileImageUrl: "/__mocks__/images/img01.png",
              username: "@taro_yamada",
              website: "https://taro_yamada.com",
            })
          );
        }),
        rest.get(`/users/following`, (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 2,
                bio: "バックエンドエンジニア。TypeScriptとPythonに興味があります。",
                location: "Kyoto, Japan",
                name: "TakuroSato",
                profileImageUrl: "/__mocks__/images/img02.png",
                email: "takuro_sato@example.com",
                followerCount: 12,
                followingCount: 31,
                username: "@takuro_sato",
                website: "https://takuro_sato.com",
              },
              {
                id: 3,
                bio: "インフラエンジニア。Dockerに興味があります。",
                location: "Kanagawa, Japan",
                name: "TakumiEhara",
                email: "takuro_sato@example.com",
                followerCount: 12,
                followingCount: 31,
                profileImageUrl: "/__mocks__/images/img02.png",
                username: "@takumi_ehara",
                website: "https://takumi_ehara.com",
              },
            ])
          );
        }),
      ],
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
