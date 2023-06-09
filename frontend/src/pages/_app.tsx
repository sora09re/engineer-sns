import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { CustomAppPage } from "next/app";
import { RecoilRoot } from "recoil";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { CommentModal } from "@/components/Modal/CommentModal/CommentModal";
import { PostModal } from "@/components/Modal/PostModal/PostModal";

const App: CustomAppPage = ({ Component, pageProps }) => {
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return page;
    });

  return (
    <RecoilRoot>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <CommentModal />
          <PostModal />
          <Sidebar />
          {getLayout(<Component {...pageProps} />)}
        </NotificationsProvider>
      </MantineProvider>
    </RecoilRoot>
  );
};

export default App;
