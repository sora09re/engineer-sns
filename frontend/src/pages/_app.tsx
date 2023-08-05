import { MantineProvider } from "@mantine/core";
import type { CustomAppPage } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

import { CommentModal } from "@/components/Modal/CommentModal/CommentModal";
import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";
import { LoginModal } from "@/components/Modal/LoginModal/LoginModal";
import { PostModal } from "@/components/Modal/PostModal/PostModal";
import { SignupModal } from "@/components/Modal/SignupModal/SignupModal";

const App: CustomAppPage<{ session: Session | null | undefined }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <SignupModal />
          <LoginModal />
          <CommentModal />
          <PostModal />
          <EditProfileModal />
          <Component {...pageProps} />
        </MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default App;
