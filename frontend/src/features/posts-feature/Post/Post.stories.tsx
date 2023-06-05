import type { Meta, StoryObj } from "@storybook/react";

import type { PostProps } from "@/features/posts-feature/Post/Post";
import { Post } from "@/features/posts-feature/Post/Post"; // PostPropsをインポート

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
    comments: 12,
    content: "Hello, world! This is a tweet.",
    likes: 321,
    reposts: 22,
  },
};

export const Code: Story = (args: PostProps) => {
  return <Post {...args} />;
};

Code.args = {
  post: {
    id: 1,
    comments: 12,
    content: "```<p>これはpタグです。</p>```",
    likes: 321,
    reposts: 22,
  },
};
