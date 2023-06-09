import { atom } from "recoil";

export const postsState = atom({
  default: [
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
  ],
  key: "postsState",
});
