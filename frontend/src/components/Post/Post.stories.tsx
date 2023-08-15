import type { Meta, StoryObj } from "@storybook/react";

import { Post } from "@/components/Post/Post"; // PostPropsをインポート
import type { PostProps } from "@/types/post";

const meta: Meta<typeof Post> = {
  component: Post,
  tags: ["autodocs"],
  title: "Post",
};

export default meta;

type Story = StoryObj<typeof Post>;

export const Default: Story = (args: PostProps) => {
  return <Post {...args} />;
};

Default.args = {
  post: {
    id: 1,
    comments: [
      {
        id: 1,
        comments: [],
        content: "This is the first comment",
        createdAt: new Date("2023-06-01T00:00:00Z"),
        isDeleted: false,
        likesCount: 5,
        postId: 1,
        repostsCount: 2,
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        userId: 2,
      },
      {
        id: 2,
        comments: [],
        content: "This is the second comment",
        createdAt: new Date("2023-06-01T00:00:00Z"),
        isDeleted: false,
        likesCount: 3,
        postId: 1,
        repostsCount: 2,
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        userId: 3,
      },
    ],
    content: "Hello, world!",
    createdAt: new Date("2023-06-01T09:00:00Z"),
    isDeleted: false,
    likesCount: 10,
    repostsCount: 2,
    updatedAt: new Date("2023-06-01T09:00:00Z"),
    userId: 1,
  },
};

// export const Code: Story = (args: PostProps) => {
//   return <Post {...args} />;
// };

// Code.args = {
//   post: {
//     id: 1,
//     comments: 12,
//     content: "```<p>これはpタグです。</p>```",
//     likes: 321,
//     reposts: 22,
//   },
// };
