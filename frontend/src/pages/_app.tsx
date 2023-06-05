import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { CustomAppPage } from "next/app";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { Sidebar } from "@/components/Sidebar/Sidebar";

export type Post = {
  id: number;
  comments: number;
  content: string;
  likes: number;
  reposts: number;
};

export type PostsProps = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
};

const App: CustomAppPage = ({ Component, pageProps }) => {
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return page;
    });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      comments: 12,
      content: "Hello, world! This is a tweet.",
      likes: 321,
      reposts: 22,
    },
    {
      id: 2,
      comments: 543,
      content: "以下はコードです。```<p>Hello World!</p>```",
      likes: 3241,
      reposts: 432,
    },
    // 他のツイート...
  ]);

  pageProps.posts = posts;
  pageProps.setPosts = setPosts;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <Sidebar posts={posts} setPosts={setPosts} />
        {getLayout(<Component {...pageProps} />)}
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;
