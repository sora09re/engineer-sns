import type { Preview } from "@storybook/react";
import { RecoilRoot } from "recoil";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { CommentModal } from "../src/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "../src/components/Modal/EditProfileModal/EditProfileModal";
import { PostModal } from "../src/components/Modal/PostModal/PostModal";

const preview: Preview = {
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
          <NotificationsProvider>
            <CommentModal />
            <PostModal />
            <EditProfileModal />
            <Story />
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    ),
  ],
};

export default preview;
