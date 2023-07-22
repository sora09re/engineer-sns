import { Flex, MantineProvider } from "@mantine/core";
import type { CustomAppPage } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

import { CommentModal } from "@/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { LoginModal } from "@/components/Modal/LoginModal/LoginModal";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { SignupModal } from "@/components/Modal/SignupModal/SignupModal";
import { Sidebar } from "@/components/Sidebar/Sidebar";

const App: CustomAppPage<{ session: Session | null | undefined }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return page;
    });

  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <SignupModal />
          <LoginModal />
          <CommentModal />
          <PostModal />
          <EditProfileModal />
          <Flex>
            <Sidebar />
            {getLayout(<Component {...pageProps} />)}
          </Flex>
        </MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default App;
