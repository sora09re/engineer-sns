import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { CustomAppPage } from "next/app";
import { RecoilRoot } from "recoil";

import { CommentModal } from "@/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { Sidebar } from "@/components/Sidebar/Sidebar";

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
          <EditProfileModal />
          {getLayout(<Component {...pageProps} />)}
        </NotificationsProvider>
      </MantineProvider>
    </RecoilRoot>
  );
};

export default App;
